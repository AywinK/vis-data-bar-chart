
// state declarations
let data;

// get data on window load
window.addEventListener("load", async (e) => {
    const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
    const resData = await res.json();
    if (resData) data = resData?.data.sort((a, b) => (new Date(a[0]) - new Date(b[0]))); // data sorted - ascending dates
    console.log(data);
    // set title
    document.getElementById("title").innerText = resData?.name;


})

// chart dimensions and margins
const width = 800;
const height = 500;
const margin = 20;

// declare x scale
const xScale = d3.scaleUtc()
    .domain([(data?.at(0)[0]), (data?.at(-1)[0])])
    .range([margin, width - margin]);

// declare y scale
const yScale = d3.scaleLinear()
    .domain([data?.at(0)[1], data?.at(-1)[1]])
    .range([height - margin, margin]);

// create svg bar chart container
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// add x-axis
svg.append("g")
    .attr("transform", `translate(0, ${height - margin})`)
    .attr("id", "x-axis")
    .call(d3.axisBottom(xScale));

// add y-axis
svg.append("g")
    .attr("transform", `translate(${margin}, 0)`)
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale));

// append svg element to root
document.getElementById("root").append(svg.node());