
// state declarations
let data;

// get data on window load
window.addEventListener("load", async (e) => {
    const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
    const resData = await res.json();
    if (resData) data = resData?.data.sort((a, b) => a[0] - b[0]); // data sorted - ascending dates
    console.log(data);
    // set title
    document.getElementById("title").innerText = resData?.name;
    renderChart();

})

function renderChart() {
    // chart dimensions and margins
    const width = 800;
    const height = 500;
    const margin = 50;

    // declare x scale
    const xScale = d3.scaleTime()
        .domain([(new Date(data?.at(0)[0])).getFullYear() + ((new Date(data.at(0)[0]).getMonth() + 1) / 12), (new Date(data?.at(-1)[0])).getFullYear() + ((new Date(data.at(-1)[0]).getMonth() + 1) / 12)])
        .range([margin, width - margin]);

    // declare y scale
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
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

    // add rect for each data point
    data && svg.append("g")
        .attr("fill", "steelblue")
        .selectAll()
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale((new Date(d[0]).getFullYear()) + ((new Date(d[0])).getMonth() + 1) / 12))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(0) - yScale(d[1]))
        .attr("width", 1)
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])

    // add x-axis with ticks
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin})`)
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale).ticks(5));

    // add y-axis with ticks
    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).ticks(10));


    // append svg element to root
    document.getElementById("root").append(svg.node());

    svg.selectAll(".bar")
        .on("mouseenter", handleMouseEnter)
        .on("mouseout", handleMouseOut);
}

const handleMouseEnter = (e, d) => {
    const x = e.pageX;
    const y = e.pageY;
    console.log(x, y)

    const divEl = document.createElement("div");
    divEl.setAttribute("id", "tooltip");
    divEl.setAttribute("data-date", d[0]);
    divEl.style.top = (y + 10) + "px";
    divEl.style.left = (x + 10) + "px";
    const tooltipHtml = `GDP: ${d[1]}`
    divEl.innerHTML = tooltipHtml
    document.getElementById("root").appendChild(divEl);
}

const handleMouseOut = () => {
    document.getElementById("tooltip").remove();
}