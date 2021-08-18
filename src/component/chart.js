const genChart = (d) => {
    $("#chart")
        .empty()
        .show()
        .html(`chart: ${d[0]}, ${d[d.length - 1]}`)
}

export { genChart }