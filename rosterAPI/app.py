from flask import Flask, request, redirect, flash, jsonify
from pymongo import MongoClient
import secrets
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)
app.config.from_pyfile("../settings.py")
app.secret_key = secrets.token_hex(16)


MONGO_URI = app.config.get("MONGO_URI")

try:
    client = MongoClient(MONGO_URI, tls = True, tlsAllowInvalidCertificates=False)
    db = client.students_db #access student db
    students = db.students #access student collection
    print("Connected to db")
except ConnectionError as exc:
    raise RuntimeError('Unable to connect to db') from exc

@app.route("/")
def home():
    return "Welcome Home"


@app.route("/create", methods = ['POST'])
def create_student():
    data = request.get_json()
    firstName = data["firstName"]
    lastName = data["lastName"]
    major = data["major"]
    gradYear = data["gradYear"]
    
    #ensure that duplicate first name/last name students cannot be added
    if students.find_one({'firstName':firstName, 'lastName': lastName}):
        print("Student already exists")
        return redirect('/')
    try:
        students.insert_one({
                'firstName': firstName, 
                'lastName': lastName, 
                'major': major, 
                'gradYear': gradYear
            })
        print("Student inserted successfully")
        flash("Student inserted successfully", "success")
    except DuplicateKeyError as e:
        print("Duplicate student error: ",e)
    except Exception as e:
        print("Error inserting student ",e)
        flash("Error inserting student", "error")
    return redirect('/')

    
#delete student based on first and last name
@app.route("/delete", methods = ['DELETE'])
def delete_student():
    data = request.get_json()
    firstName = data["firstName"]
    lastName = data["lastName"]
    try:
        students.delete_one({'firstName': firstName, 'lastName':lastName})
        flash("Student deleted successfully", "success")
    except Exception as e:
        print("Error deleting student ", e)
        flash("failure to delete student", "error")
    return {
            "statusCode": 200,
            "body": json.dumps({
                "statusCode": 200,
                "message": 'User deleted successfully',
            }),
            }

#update user based on first and last name
@app.route("/update", methods = ['POST', 'GET'])
def update_student():
    data = request.get_json()
    firstName = data["firstName"]
    lastName = data["lastName"]
    del data["_id"]
    
    updatedUser = {'$set': data}
    
    studentToUpdate = {'firstName': firstName, 'lastName': lastName}
    if students.find_one(studentToUpdate) is None:
        print("No such student exists")
    else:
        try:
            students.update_one(studentToUpdate, updatedUser)
            flash("Successfully updated student", "success")
        except Exception as e:
            print("Could not update student successfully ", e)
            flash("Student update is unsuccessful", "error")
    return {
            "statusCode": 200,
            "body": json.dumps({
                "statusCode": 200,
                "message": 'User updated successfully',
            }),
            }
        

@app.route("/read", methods = ['GET'])
def read_student():
    try:
        student_collection = list(students.find({},{}))
        print(student_collection)
        
        for student in student_collection:
            if "_id" in student:
                student["_id"] = str(student["_id"])
        return jsonify(student_collection)
    except Exception as e:
        print("Error fetching all objects from collection ",e)
    return redirect('/')

@app.route("/get_summary", methods = ['GET'])
def get_summary():
    gradYears = []
    majors = []
    stats={"majors":{}, "grad years":{}}
    try:
        majors = students.distinct('major')
        gradYears = students.distinct('gradYear')
        
        for major in majors:
            count = students.count_documents({"major":major})
            stats["majors"][major] = count
        
        for year in gradYears:
            count = students.count_documents({"gradYear":year})
            stats["grad years"][year] = count
        print(stats)
        return jsonify(stats)
        
    
    except Exception as e:
        print("Error generating statistics", e)
    return redirect('/')
        
    

if __name__ == "__main__":
    app.run(debug = True)
    client.close()
    