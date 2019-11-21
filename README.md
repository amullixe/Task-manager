# Task manager
*Task manager* is a web application created to monitor memory statistics of the system using simple and clean charts, open specific process location and completion of system processes.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

1. Set up a virtual enviroment in the *.src* folder: `python -m venv env`

2. Activate the enviroment: `env\Scripts\activate`

3. Install requerement packages from *requirements.txt*: `pip install -r requirements.txt`

4. Run the Flask application: `python -m flask run`

5. Follow the link: `http://127.0.0.1:5000/home`

6. Task manager web application should look like this:

![image](https://user-images.githubusercontent.com/43108741/69247694-dba47700-0bbb-11ea-9fc1-23bf464cee87.png)
![image](https://user-images.githubusercontent.com/43108741/69247775-0d1d4280-0bbc-11ea-8113-32f172128381.png)

## Built With

* [Flask](http://flask.palletsprojects.com/en/1.1.x/) is a micro web framework written in Python.
* [Psutil](https://psutil.readthedocs.io/en/latest/) is a cross-platform library for retrieving information on running processes and system utilization (CPU, memory, disks, network, sensors) in Python.
* [Chart.js](https://www.chartjs.org/docs/latest/) - simple, clean and engaging HTML5 based JavaScript chart.
* [Material Design Components for the web (MDC Web)](https://material.io/develop/web/) - modular and customizable Material Design UI components for the web.

## Authors

* **Andrey Mikhalev** - *Initial work* - [evilixy](https://github.com/evilixy)

## License

This project is licensed under the MIT license - see the [LICENSE](LICENSE) file for details

