'use strict'
class ChartController {

    constructor(){
        this._fileIn = null;
        this.data = null;
        this.chart = null;
    }

    displayColumns(df) {
        this.data = df;
        // get the columns
        document.getElementById("ChartCriteria").classList.remove('hidden');
        var f = df.listColumns();
        console.log(f);
        var selection = document.getElementById("featuresList");
        selection.innerHTML = "";

        for (let k = 0; k < f.length; k++) {
            let option = document.createElement("option");
            option.value = f[k];
            option.label = f[k];

            selection.appendChild(option);
        }
    }

    displayChart(){
        console.log("Displaying Chart...");
        // Get the selected chart type and feature
        let c = document.getElementById("chartType");
        let type = c.options[c.selectedIndex].value;

        let f = document.getElementById("featuresList");
        let col = f.options[f.selectedIndex].value;

        console.log("Chart type: "+type);
        console.log("Selected feature: "+col);

        if(this.chart != null){
            this.chart.destroy();
        }
        let ctx = document.getElementById('chartArea').getContext('2d');


        let heading = document.getElementById('chartHeading');
        heading.innerText = type+" chart for feature: "+col;

        let colArray = [col];
        let results = this.data.select(...colArray).toArray();

        let counts = {};
        for(let i = 0; i < results.length; i++){
            counts[results[i]] = 1 + (counts[results[i]] || 0);
        }

        // Make random colors
        let dynamicColors = function() {
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };

        let xs = [];
        let ys = [];
        let colors = [];
        for(let key in counts){
            xs.push(key);
            ys.push(counts[key]);
            colors.push(dynamicColors());
        }

        if(type=='Line'){
            this.Line(xs, ys, ctx, colors);
        }
        else if (type=='Bar'){
            this.Bar(xs, ys, ctx, colors);
        }
        else if (type == 'Pie'){
            this.Pie(xs, ys, ctx, colors);
        }
    }

    Line(xs, ys, ctx, colors){
        this.chart = new Chart(ctx, {
            type: 'line',
            data:{
                labels: xs,
                datasets: [{
                    data: ys,
                    backgroundColor: colors
                }]
            },
            options: {
                legend: {
                    display: false,
                }
            }
        });
    }

    Bar(xs, ys, ctx, colors){
        this.chart = new Chart(ctx, {
            type: 'bar',
            data:{
                labels: xs,
                datasets: [{
                    data: ys,
                    backgroundColor: colors
                }]
            },
            options: {
                legend: {
                    display: false,
                }
            }
        });
    }

    Pie(xs, ys, ctx, colors){
        this.chart = new Chart(ctx, {
            type: 'pie',
            data:{
                labels: xs,
                datasets: [{
                    data: ys,
                    backgroundColor: colors
                }]
            },
            options: {
                legend: {
                    display: false,
                }
            }
        });
    }


}