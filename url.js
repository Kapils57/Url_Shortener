
const form = document.getElementById("shorten-form")




form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target))
    console.log(formData)
    // const url = document.getElementById("url")
    // const shortCode = document.getElementById("shortCode")
    // console.log(url.value, shortCode.value)

    const response = await fetch('https://url-shortener-2-iek5.onrender.com/shorten', {
        method:"POST" ,
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    })
    
        const result = await response.json()
        console.log(result)
    
    


    if(response.ok) {
        const list = document.getElementById("shortened-urls")
        const li = document.createElement("li")
        li.innerHTML = `<a href="${result.shortUrl}">${result.shortUrl}</a>`
        list.appendChild(li)
    } else {
        alert(result.message)  // show error to user
        const list = document.getElementById("shortened-urls")
        const li = document.createElement("li")
        li.innerHTML = `<a href="${result.shortUrl}">${result.shortUrl}</a>`
        list.appendChild(li)

    }
    
})
