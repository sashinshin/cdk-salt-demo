const button = document.getElementById("button");

button.addEventListener("click", async () => {
    const endpoint = "https://9zw02nbeb0.execute-api.eu-west-1.amazonaws.com/prod/resource"
    const res = await fetch(endpoint).then(res => res.json()).then(data => data);
    const parsed = await JSON.parse(res)


    const dataContainer = document.getElementById("data-container");
    const node = document.createTextNode(`Data fetched contained: ${parsed.hello}`);
    dataContainer.append(node)

    button.remove();
});

