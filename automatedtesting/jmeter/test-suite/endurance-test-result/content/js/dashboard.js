/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.42857142857143, "KoPercent": 3.5714285714285716};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9642857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "DELETE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE User"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Authors"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Author"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP 404 Request"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE User"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover Photo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Author"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Activities"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Books"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET Author By Id"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Users"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Author"], "isController": false}, {"data": [1.0, 500, 1500, "GET Activity By Id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Book By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Author By IDBook"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE User"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Cover Photos By IDBook"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 280, 10, 3.5714285714285716, 2.1357142857142852, 0, 64, 1.0, 3.0, 5.0, 15.949999999999989, 300.42918454935625, 1758.6758986051502, 67.40691221834764], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DELETE Cover Photo", 10, 0, 0.0, 0.8999999999999999, 0, 2, 1.0, 1.9000000000000004, 2.0, 2.0, 11.723329425556859, 2.415646981242673, 2.3824461459554516], "isController": false}, {"data": ["DELETE User", 10, 0, 0.0, 1.2999999999999998, 0, 2, 1.0, 2.0, 2.0, 2.0, 11.668611435239207, 2.404372082847141, 2.3029554404900816], "isController": false}, {"data": ["CREATE Book", 10, 0, 0.0, 1.4, 1, 2, 1.0, 2.0, 2.0, 2.0, 11.587485515643106, 4.61688876013905, 4.305701404982619], "isController": false}, {"data": ["GET All Cover Photos", 10, 0, 0.0, 1.6, 1, 2, 2.0, 2.0, 2.0, 2.0, 11.695906432748536, 236.8763706140351, 2.101608187134503], "isController": false}, {"data": ["GET All Authors", 10, 0, 0.0, 1.8000000000000003, 1, 3, 2.0, 2.9000000000000004, 3.0, 3.0, 11.668611435239207, 433.92420872228706, 2.051123103850642], "isController": false}, {"data": ["UPDATE Author", 10, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 11.695906432748536, 3.6709612573099415, 3.27234100877193], "isController": false}, {"data": ["HTTP 404 Request", 10, 10, 100.0, 1.2000000000000002, 1, 2, 1.0, 2.0, 2.0, 2.0, 11.7096018735363, 5.054339871194379, 2.0125878220140514], "isController": false}, {"data": ["UPDATE User", 10, 0, 0.0, 1.2999999999999998, 1, 2, 1.0, 2.0, 2.0, 2.0, 11.655011655011656, 3.58869645979021, 3.1117970571095572], "isController": false}, {"data": ["GET Cover Photo By Id", 10, 0, 0.0, 1.7000000000000002, 1, 2, 2.0, 2.0, 2.0, 2.0, 11.695906432748536, 4.0707236842105265, 2.1255939327485383], "isController": false}, {"data": ["CREATE Cover Photo", 10, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 11.7096018735363, 3.5483295521077283, 3.1252287031615924], "isController": false}, {"data": ["DELETE Author", 10, 0, 0.0, 1.0000000000000002, 0, 2, 1.0, 2.0, 2.0, 2.0, 11.695906432748536, 2.40999634502924, 2.3311860380116958], "isController": false}, {"data": ["GET User By Id", 10, 0, 0.0, 1.5, 1, 3, 1.0, 2.9000000000000004, 3.0, 3.0, 11.627906976744185, 3.5235737645348837, 2.0451035610465116], "isController": false}, {"data": ["GET All Activities", 10, 0, 0.0, 12.3, 9, 20, 11.5, 19.5, 20.0, 20.0, 11.223344556677889, 33.97692199775533, 2.0057344276094278], "isController": false}, {"data": ["GET All Books", 10, 0, 0.0, 10.3, 3, 64, 4.0, 58.20000000000002, 64.0, 64.0, 11.520737327188941, 1097.1094650057603, 2.002628168202765], "isController": false}, {"data": ["DELETE Activity", 10, 0, 0.0, 1.1, 0, 2, 1.0, 2.0, 2.0, 2.0, 11.520737327188941, 2.3739019297235022, 2.330024121543779], "isController": false}, {"data": ["UPDATE Cover Photo", 10, 0, 0.0, 1.1, 0, 2, 1.0, 2.0, 2.0, 2.0, 11.7096018735363, 3.5483295521077283, 3.1378073770491803], "isController": false}, {"data": ["DELETE Book", 10, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 11.614401858304298, 2.3932019454123115, 2.292256460511034], "isController": false}, {"data": ["GET Author By Id", 10, 0, 0.0, 2.1, 1, 3, 2.0, 3.0, 3.0, 3.0, 11.668611435239207, 3.7638108955659275, 2.075052873395566], "isController": false}, {"data": ["UPDATE Book", 10, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 11.614401858304298, 4.6276132404181185, 4.328179442508711], "isController": false}, {"data": ["GET All Users", 10, 0, 0.0, 0.8999999999999999, 0, 2, 1.0, 1.9000000000000004, 2.0, 2.0, 11.614401858304298, 8.892276422764228, 2.018909698025552], "isController": false}, {"data": ["CREATE Author", 10, 0, 0.0, 1.1, 1, 2, 1.0, 1.9000000000000004, 2.0, 2.0, 11.695906432748536, 3.6709612573099415, 3.259777046783626], "isController": false}, {"data": ["GET Activity By Id", 10, 0, 0.0, 1.7, 1, 3, 2.0, 2.9000000000000004, 3.0, 3.0, 11.481056257175661, 3.942128300803674, 2.0753354621125144], "isController": false}, {"data": ["GET Book By Id", 10, 0, 0.0, 3.900000000000001, 3, 6, 4.0, 5.9, 6.0, 6.0, 11.547344110854503, 8.358292436489608, 2.0309342523094687], "isController": false}, {"data": ["Get All Author By IDBook", 10, 0, 0.0, 1.9, 1, 2, 2.0, 2.0, 2.0, 2.0, 11.682242990654204, 5.085882739485982, 2.100293881425234], "isController": false}, {"data": ["UPDATE Activity", 10, 0, 0.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 11.507479861910243, 2.9442966052934407, 3.5039377157652476], "isController": false}, {"data": ["CREATE User", 10, 0, 0.0, 1.2000000000000002, 1, 2, 1.0, 2.0, 2.0, 2.0, 11.655011655011656, 3.58869645979021, 3.0992770250582753], "isController": false}, {"data": ["CREATE Activity", 10, 0, 0.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 11.507479861910243, 2.9442966052934407, 3.491576165132336], "isController": false}, {"data": ["Get All Cover Photos By IDBook", 10, 0, 0.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 11.7096018735363, 4.098360655737705, 2.0937774443793913], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 10, 100.0, 3.5714285714285716], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 280, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HTTP 404 Request", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
