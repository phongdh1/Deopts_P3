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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "DELETE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE User"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Cover Photos"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Authors"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Author"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE User"], "isController": false}, {"data": [1.0, 500, 1500, "GET Cover Photo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Author"], "isController": false}, {"data": [1.0, 500, 1500, "GET User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Activities"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Books"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Cover Photo"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET Author By Id"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Book"], "isController": false}, {"data": [1.0, 500, 1500, "GET All Users"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Author"], "isController": false}, {"data": [1.0, 500, 1500, "GET Activity By Id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Book By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Author By IDBook"], "isController": false}, {"data": [1.0, 500, 1500, "UPDATE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE User"], "isController": false}, {"data": [1.0, 500, 1500, "CREATE Activity"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Cover Photos By IDBook"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 810, 0, 0.0, 2.4962962962962942, 0, 304, 1.0, 4.0, 6.0, 14.0, 84.51585976627712, 539.1532885212333, 19.189391987948664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DELETE Cover Photo", 30, 0, 0.0, 0.8999999999999999, 0, 2, 1.0, 1.0, 2.0, 2.0, 3.272608268790226, 0.674336274135486, 0.6650681452492637], "isController": false}, {"data": ["DELETE User", 30, 0, 0.0, 1.0000000000000004, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.2601608346011735, 0.671771421973484, 0.6434360397196262], "isController": false}, {"data": ["CREATE Book", 30, 0, 0.0, 1.2333333333333334, 1, 2, 1.0, 2.0, 2.0, 2.0, 3.2552083333333335, 1.3065338134765625, 1.2191136678059897], "isController": false}, {"data": ["GET All Cover Photos", 30, 0, 0.0, 1.9333333333333331, 1, 6, 2.0, 3.0, 5.449999999999999, 6.0, 3.2686859882327304, 66.20046749019393, 0.5873420135105687], "isController": false}, {"data": ["GET All Authors", 30, 0, 0.0, 2.8333333333333335, 1, 7, 2.0, 5.800000000000004, 7.0, 7.0, 3.2605151613955003, 149.62729085153788, 0.5731374307140528], "isController": false}, {"data": ["UPDATE Author", 30, 0, 0.0, 1.3000000000000005, 0, 4, 1.0, 2.0, 3.4499999999999993, 4.0, 3.2654838358550125, 1.0325817051268098, 0.9212873829868293], "isController": false}, {"data": ["UPDATE User", 30, 0, 0.0, 1.166666666666667, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.259452411994785, 1.009348007659713, 0.8759778357235983], "isController": false}, {"data": ["GET Cover Photo By Id", 30, 0, 0.0, 1.5333333333333332, 1, 4, 1.0, 2.900000000000002, 3.4499999999999993, 4.0, 3.2701111837802483, 1.1381519784172662, 0.5943043860366253], "isController": false}, {"data": ["CREATE Cover Photo", 30, 0, 0.0, 1.1, 0, 3, 1.0, 2.0, 3.0, 3.0, 3.2711808963035653, 0.9970073806018973, 0.8788104146221787], "isController": false}, {"data": ["DELETE Author", 30, 0, 0.0, 1.0666666666666669, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.266906239790918, 0.6731613443319177, 0.6511480112708266], "isController": false}, {"data": ["GET User By Id", 30, 0, 0.0, 1.4333333333333333, 0, 4, 1.0, 2.900000000000002, 4.0, 4.0, 3.257682701704854, 0.9871669358779456, 0.5729576704853947], "isController": false}, {"data": ["GET All Activities", 30, 0, 0.0, 24.16666666666666, 10, 304, 11.5, 15.0, 185.74999999999983, 304.0, 3.141361256544503, 9.531454515706805, 0.561395615183246], "isController": false}, {"data": ["GET All Books", 30, 0, 0.0, 5.666666666666666, 3, 18, 5.0, 7.0, 18.0, 18.0, 3.2481593763534, 309.3037561918038, 0.5646214540926807], "isController": false}, {"data": ["DELETE Activity", 30, 0, 0.0, 1.0666666666666669, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.2485110990795887, 0.6693709393611262, 0.6569986802923661], "isController": false}, {"data": ["UPDATE Cover Photo", 30, 0, 0.0, 1.1333333333333333, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.2718944268731596, 0.9972248541280401, 0.8825168366234049], "isController": false}, {"data": ["DELETE Book", 30, 0, 0.0, 1.0666666666666667, 0, 3, 1.0, 1.9000000000000021, 2.4499999999999993, 3.0, 3.25626831650928, 0.6709693503744709, 0.6426677995766852], "isController": false}, {"data": ["GET Author By Id", 30, 0, 0.0, 1.6333333333333337, 1, 5, 1.0, 2.900000000000002, 4.449999999999999, 5.0, 3.262997607135088, 1.052507919567109, 0.5802654924407221], "isController": false}, {"data": ["UPDATE Book", 30, 0, 0.0, 1.2333333333333332, 0, 3, 1.0, 2.0, 2.4499999999999993, 3.0, 3.255561584373304, 1.306675596852957, 1.222743149755833], "isController": false}, {"data": ["GET All Users", 30, 0, 0.0, 1.2333333333333334, 0, 3, 1.0, 2.0, 3.0, 3.0, 3.256975355553143, 2.493621756595375, 0.5661539192270112], "isController": false}, {"data": ["CREATE Author", 30, 0, 0.0, 1.166666666666667, 0, 4, 1.0, 2.0, 3.4499999999999993, 4.0, 3.264417845484222, 1.032244627312296, 0.9174799374319913], "isController": false}, {"data": ["GET Activity By Id", 30, 0, 0.0, 1.5000000000000002, 1, 3, 1.0, 2.900000000000002, 3.0, 3.0, 3.244997295835587, 1.1144115062195783, 0.5865712885343429], "isController": false}, {"data": ["GET Book By Id", 30, 0, 0.0, 4.933333333333333, 2, 43, 3.5, 5.900000000000002, 23.199999999999974, 43.0, 3.2530904359141184, 2.354678350683149, 0.5721499878009109], "isController": false}, {"data": ["Get All Author By IDBook", 30, 0, 0.0, 1.5999999999999999, 1, 4, 1.0, 2.900000000000002, 4.0, 4.0, 3.2676179065461275, 1.5580751007515523, 0.5874691958936935], "isController": false}, {"data": ["UPDATE Activity", 30, 0, 0.0, 1.5, 1, 2, 1.5, 2.0, 2.0, 2.0, 3.247807729782397, 0.8309820558622929, 0.9927381049041897], "isController": false}, {"data": ["CREATE User", 30, 0, 0.0, 1.0666666666666669, 0, 2, 1.0, 1.9000000000000021, 2.0, 2.0, 3.2587442971974796, 1.0091287271887899, 0.8722869256463177], "isController": false}, {"data": ["CREATE Activity", 30, 0, 0.0, 1.5, 1, 6, 1.0, 2.0, 6.0, 6.0, 3.2456994482310937, 0.8304426322622525, 0.98860708779617], "isController": false}, {"data": ["Get All Cover Photos By IDBook", 30, 0, 0.0, 1.4333333333333331, 1, 3, 1.0, 2.900000000000002, 3.0, 3.0, 3.2729653065677504, 1.1455378572987125, 0.585234323859917], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 810, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
