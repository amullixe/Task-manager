/*
Copyright (c) 2019 Andrey Mikhalev
The full license agreement can be found in the following link:
https://github.com/evilixy/Task-manager/blob/master/LICENSE
*/

'use strict';

let sorting = true;
let charts = {};
let assocNameIdInProc = {};
let processes = new Map();

// sort processes ascending
function sortProcesses(proc) {
    let sortedProcessesArray = [];
    let sortedProcessesObject = new Map();

    sortedProcessesArray = Object
    .keys(proc).sort(function(a, b){
        return proc[a]['memory'] - proc[b]['memory'];
    });

    for( let i = 0; i < sortedProcessesArray.length; i++ ) {
        let currKey = sortedProcessesArray[i];
        // do association name=id
        assocNameIdInProc[ proc[currKey]['name'] ] = currKey;

        sortedProcessesObject.set(currKey, proc[currKey]);
    }
    return sortedProcessesObject
}

function setProcesses(proc) {
    processes = sortProcesses(proc);
}

// get sorted data for the chart: 
// resulting object: {'labels': Array, 'memory': Array, 'colors': Array}
function getDataFromProcs(id_to_remove=null) {
    let labels = [];
    let memory = [];
    let colors = [];
    
    if(id_to_remove != null) {
        processes.delete(id_to_remove);
    }

    for( let id of processes.keys() ) {
        labels.push( processes.get(id)['name'] );
        memory.push( processes.get(id)['memory'] );
        colors.push( processes.get(id)['color'] );
    }

    return {'labels': labels, 'memory': memory, 'colors': colors};
}

// update labels, memory or colors in the chart by the given data
function updateDataInCharts(data) {
    for( let chart_name in charts ) {
        charts[chart_name].data.labels = data['labels'];
        charts[chart_name].data.datasets[0].data = data['memory'];
        charts[chart_name].data.datasets[0].backgroundColor = data['colors'];
        charts[chart_name].update();
    } 
}

// communicate with the server by transmitting the process
// for deletion or the ID of the process to open the directory
// of current process
function passProcParams(elem, serverUrl, deleteItem=false) {

    let formData = new FormData();

    if(deleteItem) {
        let index_to_delete = elem.parentNode.previousElementSibling.getAttribute('id');

        let new_data_for_chart = getDataFromProcs(index_to_delete)
        updateDataInCharts(new_data_for_chart);

        // delete current element from list
        let ul = document.getElementById('listContainer');
        ul.removeChild(elem.parentNode.parentNode);

        formData.append("proc_to_delete", elem.parentNode.previousElementSibling.innerText)
    } else {
        formData.append("id_proc", elem.parentNode.previousElementSibling.getAttribute('id'))
    }

    const Http = new XMLHttpRequest();
    const url = serverUrl;
    Http.open("POST", url);
    Http.send(formData);

    Http.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let responseMessage = JSON.parse(this.responseText)['response_message'];
            // open response message from the server
            alert(responseMessage);
        }
    }
}

// search specific process in the list
function doSearchInList() {
    let input, filter, ul, li, span, txtValue;

    input = document.getElementById('searchBar');
    filter = input.value.toLowerCase();
    ul = document.getElementById("listContainer");
    li = ul.getElementsByTagName('li');
  
    // Loop through all list items, and hide those who don't match the search query
    for (let i = 0; i < li.length; i++) {
      span = li[i].getElementsByTagName("span")[0];
      txtValue = span.textContent || span.innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  // sort list of processes ascending or descending
  function sortList() {
    let ul = document.getElementById("listContainer");
  
    if (sorting) {
        Array.from(ul.getElementsByTagName("LI"))
        .sort((a, b) => a.textContent.localeCompare(b.textContent))
        .forEach(li => ul.appendChild(li));
        sorting = false;
    } else {
        Array.from(ul.getElementsByTagName("LI"))
        .sort((a, b) => b.textContent.localeCompare(a.textContent))
        .forEach(li => ul.appendChild(li));
        sorting = true;
    }
  }

// create a chart and fill up with data 
function draw_chart(data, chartType, canvas_id) {
    let ctx = document.getElementById(canvas_id).getContext('2d');
    let currChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data['labels'],
            datasets: [{
                label: 'Memory Value:',
                data: data['memory'],
                backgroundColor: data['colors'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    charts[chartType] = currChart;
}