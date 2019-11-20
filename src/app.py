"""
Copyright (c) 2019 Andrey Mikhalev
The full license agreement can be found in the following link:
https://github.com/evilixy/Task-manager/blob/master/LICENSE
"""

from flask import Flask, render_template, redirect, url_for, request
from strings import strings
import psutil
import subprocess
import collections
import random
import os


class Processes:
    def __init__(self):
        # scan the system for running processes
        self.set_current_procs()

    def get_processes(self):
        return self.processes
    
    # open dir by the element ID which was generated on the start when system was scanned
    def try_open_dir_by_elem_id(self, id):
        if int(id) in self.dirs:
            subprocess.Popen(["explorer", "/select,", self.dirs[int(id)]], shell=True)
            return True
        else:
            False

    # kill the process if there's one in the current system
    def kill_proccess_by_name(self, proc_name):
        for proc in psutil.process_iter(attrs=['pid','name']):
            try:
                if proc.name() == proc_name:
                    proc.kill()
                    return True
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        return False

    # return dict of running system processes and create a directory paths by the id of process
    # Processes dict: [id of the process]{ [name of process], [memory], [color, which will be displayed in the chart] }
    # Dirs dict: [id of the process]: [path to the process]
    def set_current_procs(self):
        processes = dict()
        dirs = dict()
        curr_iter = 0
        passed_procs = []

        for proc in psutil.process_iter(attrs=['pid','name', 'cwd']):
            try:
                # if this is a new name then create a new key in the dict
                if proc.info['name'] not in passed_procs:
                    curr_iter += 1
                    processes[curr_iter] = dict()
                    processes[curr_iter]['name'] = proc.info['name']
                    processes[curr_iter]['memory'] = 0
                    processes[curr_iter]['color'] = self.generate_color()
                    
                    # if there's a directory to the process
                    if proc.info['cwd'] is not None:
                        curr_path = os.path.join( str(proc.info['cwd']), proc.info['name'] )
                        # and if this directory exists then add it to the dirs dict
                        if os.path.exists(curr_path):
                            dirs[curr_iter] = curr_path
                    passed_procs.append(proc.info['name'])
                processes[curr_iter]['memory'] += proc.memory_info().vms / (1024 * 1024)
                
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass

        self.processes = processes
        self.dirs = dirs

    # return generated rgb color
    def generate_color(self):
        r_color = random.randint(0, 255)
        g_color = random.randint(0, 255)
        b_color = random.randint(0, 255)

        result_rgb = "rgb({}, {}, {})".format(r_color, g_color, b_color)

        return result_rgb

processes = Processes()
app = Flask(__name__)

@app.route("/home")
def hello():
    procs = processes.get_processes()
    return render_template('main.html', title='Home', procs=procs)

@app.route("/kill_proccess/", methods = ['POST'])
def kill_proccess():
    is_killing_proc_successful = processes.kill_proccess_by_name(request.form['proc_to_delete'])
    if is_killing_proc_successful:
        response_message = strings['proc_success_killed']
    else:
        response_message = strings['proc_wasnt_killed']
    return {'response_message': response_message}

@app.route("/open_proccess_directory/", methods = ['POST'])
def open_proccess_directory():
    is_dir_open = processes.try_open_dir_by_elem_id(request.form['id_proc'])
    if not is_dir_open:
        response_message = strings['file_dir_not_found']
    else:
        response_message = strings['success_open_file_dir']

    return {'response_message': response_message}