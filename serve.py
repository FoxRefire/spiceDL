from flask import Flask
from flask import Response
from flask_cors import CORS
import uuid
import json
import subprocess

app = Flask(__name__)
cors = CORS(app)
process={}

@app.route('/spicedl/start/<string:name>/<path:url>')
def start(name, url):
    global process
    proc_uuid = str(uuid.uuid4())
    process[proc_uuid]={
        "name": name,
        "proc": subprocess.Popen(['spotdl', url])
    }
    return proc_uuid

@app.route('/spicedl/remove/<string:uuid>')
def remove(uuid):
    global process
    try:
        process[uuid]["proc"].kill()
    except:
        pass
    del process[uuid]
    return "OK"

@app.route('/spicedl/status')
def status():
    global process
    ret={}
    for k in process.keys():
        if process[k]["proc"].poll() is None:
            ret[k] = {
                "name": process[k]["name"],
                "status": 'Running'
            }
        else:
            ret[k] = {
                "name": process[k]["name"],
                "status": "Finished" if process[k]["proc"].poll()==0 else "Failed"
            }
    return Response(json.dumps(ret), mimetype='application/json')

if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=True)
