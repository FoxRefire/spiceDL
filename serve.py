from flask import Flask
from flask import Response
from flask_cors import CORS
from tkinter import Tk
from tkinter.filedialog import askdirectory
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

    try:
        with open('./spicedl.config') as f: path = f.readline().rstrip()
        if path:
            args=['spotdl', url, '--output', path]
        else:
            raise
    except:
        args=['spotdl', url]

    process[proc_uuid]={
        "name": name,
        "proc": subprocess.Popen(args)
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

@app.route('/spicedl/downloadDir/set')
def downloadDirSet():
    path = askdirectory(title='Select Folder')
    with open('./spicedl.config', mode='w') as f: f.write(path)
    return "OK"

@app.route('/spicedl/downloadDir/get')
def downloadDirGet():
    try:
        with open('./spicedl.config') as f: path = f.readline().rstrip()
    except:
        path=""
    return path

@app.route('/spicedl/downloadDir/reset')
def downloadDirReset():
    with open('./spicedl.config', mode='w') as f: f.write("")
    return "OK"

if __name__ == "__main__":
    app.run(debug=True, port=8888, threaded=True)
