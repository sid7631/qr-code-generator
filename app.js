let btn = document.getElementById('generate-qr')
let qr_code_element = document.querySelector(".qr-code")

btn.addEventListener("click", () => {
    let user_input = document.querySelector('#qr-text')
    if(user_input.value != "") {
        if(qr_code_element.childElementCount==0){
            generate_qr(user_input)
        } else {
            qr_code_element.innerHTML = ''
            generate_qr(user_input)
        }
    } else {
        console.log("not valid")
        qr_code_element.style = "display:none"
    }
})

function generate_qr(user_input) {
    qr_code_element.style = ''
    var qrcode = new QRCode(document.querySelector(".qr-code"), {
        text: `${user_input.value}`,
        width: 180, //default 128
        height: 180,
        colorDark : "#ffffff",
        colorLight : "#447BF1",
        correctLevel : QRCode.CorrectLevel.H
    });
}

// generate_qr({value:'siddharth'})