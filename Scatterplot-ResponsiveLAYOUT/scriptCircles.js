

function parseCsv(d) {
    if(d.isPlanet === 'TRUE') {
        return {
            density: +d.density,
            gravity: +d.gravity,
            radius: +d.meanRadius,
            name: d.eName,
            inclination: +d.inclination, 

        }    
    }
}

/* 
Parse AND LOAD THE DATA
*/


d3.csv("./data/sol_data.csv", parseCsv).then(function(data) {

/*
DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
*/
    // const width = document.querySelector("#chart").clientWidth;
    // const height = document.querySelector("#chart").clientHeight;
    const width = 1000;
    const height = 600;

    const margin = {top: 50, left: 150, right: 50, bottom: 100};

    const svg = d3.select("#chart")
        .append("svg")
        // .attr("width", width)
        // .attr("height", height);
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");


/*
DETERMINE MIN AND MAX VALUES OF VARIABLES
*/

    const DensityLength = {
        min: d3.min(data, function(d) { return d.density; }),
        max: d3.max(data, function(d) { return d.density; })
    };

    const Gravity = {
        min: d3.min(data, function(d) { return d.gravity; }),
        max: d3.max(data, function(d) { return d.gravity; })
    };

    const Radius = {
        min: d3.min(data, function(d) { return d.radius; }),
        max: d3.max(data, function(d) { return d.radius; })
    }

const Planets = ["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Pluto","Uranus","Neptune", "136108 Haumea", "136472 Makemake","1 Cerens","136199 Eris"];

    /*
    TASK 4: CREATE SCALES
    */

    const xScale = d3.scaleLinear()
        .domain([DensityLength.min, DensityLength.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([Gravity.min, Gravity.max])
        .range([height-margin.bottom, margin.top, ]);


        // add more colors for further planets!
    const fillScale = d3.scaleOrdinal()
        .domain(Planets)
        .range(['#A17F5D','#E89624','#518E87','#964120','#F8800F','#E0B463',"#D1E3F4", '#515CA8', '#2990B5', '#FACDDC', '#FAA1AF', '#8d7979', '#D4cccc']);

    const planetScale = d3.scaleLinear()
        .domain([0, Radius.max])
        .range([5, 50]);


    /*
    DRAW AXES
    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        // .attr("fill", "lightgrey");

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale))
        // .attr("fill", "lightgrey");


    /*
    TASK 5: DRAW POINTS
    */
    const points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.density); })
            .attr("cy", function(d) { return yScale(d.gravity); })
            .attr("r", function(d) { return planetScale(d.radius/2); })
            // .attr("r", 5)
            .attr("fill-opacity", 1)
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("fill", function(d) { return fillScale(d.name); });

    
    /*
    DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Planet Density in Kg/m3")
        .attr("fill", "#B2A7B7");;

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Gravity in m/s^2 ")
        .attr("fill", "#B2A7B7");


//<<<<>>>><<<<ooOoo>>>>((((()))))<<<<ooOoo>>>><<<<>>>>\\
//<<<<>>>><<<<>>>>((((( ADD TOOLTIP)))))<<<<>>>><<<<>>>>\\
//<<<<>>>><<<<ooOoo>>>>((((()))))<<<<ooOoo>>>><<<<>>>>\\

const tooltip = d3.select("#chart")
.append("div")
.attr("class", "tooltip");

 /* CREATING SCALE FACTORS*/
 let tw = svg.node().clientWidth;
 let th = svg.node().clientHeight;
 let sx = tw / width;
 let sy = th / height;


svg.selectAll("circle")
.on("mouseover", function(e, d) { //first argument e referes to the circle, d refers to datum!
// console.log(e)
    // let x = +d3.select(this).attr("cx") ;
    // let y = +d3.select(this).attr("cy") ;
    let x = sx*(+d3.select(this).attr("cx")) ;
    let y = sy*(+d3.select(this).attr("cy")) ;

    tooltip.style("visibility", "visible") 
        .style("left", x + "px") 
        .style("top", y + "px") 
        .html(`Name: <b>${d.name}</b>
                <br>Gravity:<b> ${d.gravity} m/s^3 </b>
                <br>Density: <b>${d.density} Kg/m3 </b>
                <br>Avg Radius:<b> ${d.radius} Km </b>
                <br>Inclination:<b> ${d.inclination}° </b> `);

    d3.select(this)
        .attr("r", function(d) { return planetScale(d.radius/1.8); } )
        // .attr("stroke", "white")
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 1);

}).on("mouseout", function() {

    tooltip.style("visibility", "hidden");

    d3.select(this)
        .attr("r", function(d) { return planetScale(d.radius/2); })
        // .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.5);

});

//////<<<<<<<<<<<>>>>>>>>>>>>\\\\\\\\
//////<<<<<<<<<<<>>>>>>>>>>>>\\\\\\\\
////<<<<<<<<<ADDING LEGEND>>>>>>>>>>\\\\
//////<<<<<<<<<<<>>>>>>>>>>>>\\\\\\\\
//////<<<<<<<<<<<>>>>>>>>>>>>\\\\\\\\

// const legendWidth = document.querySelector("#legend").clientWidth;
const legendWidth = 300;
const colorLegendHeight = 370;
const sizeLegendHeight = 200;
const legendMargin = 25;
const legendSpacing = 50;

const colorLegend = d3.select("#legend")
    .append("svg")
    // .attr("width", legendWidth)
    // .attr("height",400);
    .attr("viewBox", `0 0 ${legendWidth} ${colorLegendHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

    colorLegend.append("text")
    .attr("class", "legend--title")
    .attr("x", 5)
    .attr("y", 15 + 0)
    .html(`Color:`);

    Planets.forEach(function(category, i) {
                colorLegend.append("circle")
                    .attr("cx", 15)
                    .attr("cy", 45 + i*25)
                    .attr("r", 10)
                    .attr("fill", fillScale(category))
                    .attr("stroke-width", 0.5)
                    .attr("fill-opacity", 1)
                    .attr("stroke",  "white");

                colorLegend.append("text")
                    .attr("class", "legend--label")
                    .attr("x", 35)
                    .attr("y", 45 + i*25)
                    .html(`${category}`);
                    
        
    });


    const sizeLegend = d3.select("#legend")
    .append("svg")
    .attr("class", "sizelegend")
    // .attr("width", legendWidth)
    // .attr("height",300)
    .attr("viewBox", `0 0 ${legendWidth} ${sizeLegendHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

    const PlanetSizes = [Radius.min, (Radius.max - Radius.min)/2,Radius.max];



    sizeLegend.append("text")
    .attr("class", "legend--title")
    .attr("x", 5)
    .attr("y", 20)
    .html(`Radius Size:`);

    PlanetSizes.forEach(function(planetRadius, i) {

        /* 
        Since we're working with number values,
        it can be helpful to format the numbers
        to something a bit more human-readable.
        
        See: https://github.com/d3/d3-format/blob/v3.1.0/README.md#format
        */

        let displayValue = d3.format(",")(planetRadius);

        sizeLegend.append("circle")
        .attr("cx", 35)
        .attr("cy", 44 + i*50)
        .attr("r", planetScale(planetRadius/2) )
        .attr("fill", "#CCCCCC");

        sizeLegend.append("text")
        .attr("class", "legend--label")
        .attr("x", 75)
        .attr("y", 44 + i*50)
        .html(`${displayValue} Km`);


    });



        /* LISTENING FOR RESIZE EVENTS */
    d3.select(window).on("resize", function(e) {

        let tw = svg.node().clientWidth;
        let th = svg.node().clientHeight;
        sx = tw / width;
        sy = th / height;


        /*
        Inside the window resize event handler, if() {} else {}
        */
        let windowWidth = window.innerWidth;
        // console.log(windowWidth);
        if(windowWidth > 1000) {

            const points = svg.selectAll("circle")
                .attr("r", function(d) { return 2 * rScale(d.comments)})

                // const rScale = d3.scaleSqrt()
                // .domain([comments.min, comments.max])
                // .range([2, 10]);

        } else {

            const points = svg.selectAll("circle")
            .attr("r", function(d) { return rScale(d.comments)})

            // const rScale = d3.scaleSqrt()
            // .domain([comments.min, comments.max])
            // .range([4, 20]);
            
        }

    });



});
