const fs = require('fs')
const https = require('https');
var allData = new Object()
var firstThreeDigit = new Object()
var lastThreeDigit = new Object()
var twoDigit = new Object()
var firstPrize = new Object()
var secondPrize = new Object()
var thirdPrize = new Object()
var forthPrize = new Object()
var fifthPrize = new Object()
//รางวัลที่ 5 เริ่มงวด 16 เมษายน 2543
//เลขหน้า 3 ตัว เริ่มงวด 1 กันยายน 2558
async function setData(info){
    //index = [info,...index]
    await getRound(info)
}
async function getData(year) {
    var data =""
    const url = `https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%9B%E0%B8%B5-${year}.aspx`;
    return new Promise((resolve,reject)=>{
        https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        data = body
        data = data.toString()
        var regex = /งวดวันที่.*" target/gi
        var result
        while(result = regex.exec(data)){
            info = result[0].split(' ')
            var day = info[1]
            var month = info[2]
            var year = info[3]
            year = year.substring(0,year.length-1)
            resolve(setData({day,month,year}))
        }
    });
    });
})
}
async function getRound(round) {
    var data = ""
    const url = `https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%87%E0%B8%A7%E0%B8%94-${round.day}-${round.month}-${round.year}.aspx`
    return new Promise((resolve,reject)=>{
        https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", () => {
        data = body
        data = data.toString()
        var regex= /background-color:#FFE.*b>/gi
        var result
        var count = 0
        while(result = regex.exec(data)){
            var info = result[0].split("b>")
            info = info[1].split("</")
            info = info[0]
            if(info.length > 7){
                info = info.split("&nbsp; ")
            }
            if(count === 0){
                if(firstPrize[info]){
                    firstPrize[info]+=1
                }
                else{
                    firstPrize[info] = 1
                }
                two = info.substring(info.length-2)
                if(allData[two]){
                    allData[two]+=1
                } else{
                    allData[two] =1
                }
            }
            else if (count ===1){
                for(let i = 0 ;i<info.length;i++){
                    if(firstThreeDigit[info[i]]){
                        firstThreeDigit[info[i]]+=1
                    } else{
                        firstThreeDigit[info[i]] = 1
                    }
                }
            }
            else if (count === 2){
                for(let i = 0 ;i<info.length;i++){
                    if(lastThreeDigit[info[i]]){
                        lastThreeDigit[info[i]]+=1
                    } else{
                        lastThreeDigit[info[i]] = 1
                    }
                    twoa = info[i].substring(info[i].length-2)
                    if(allData[twoa]){
                        allData[twoa]+=1
                    } else{
                        allData[twoa] =1
                    }
                }
            }
            else if(count === 3){
                if(info.length >2){
                    info = info.substring(0,2)
                }
                if(twoDigit[info]){
                    twoDigit[info]+=1
                }
                else{
                    twoDigit[info] = 1
                }
                if(allData[info]){
                    allData[info]+=1
                }
                else{
                    allData[info] = 1
                }
            }
            count+=1
        }
        var regex2 = /ltr_dc ltr-fx ltr_c20'>....../gi
        var count2 = 0
        while(result = regex2.exec(data)){
            info = result[0].split('>')
            info = info[1]
            if(info === '<font '){
                continue
            }
            count2+=1
            if(count2 <= 5){
                if(secondPrize[info]){
                    secondPrize[info]+=1
                }else{
                    secondPrize[info]=1
                }
            }
            else if(count2 <= 15){
                if(thirdPrize[info]){
                    thirdPrize[info]+=1
                }else{
                    thirdPrize[info]=1
                }
            }
            else if(count2 <= 65){
                if(forthPrize[info]){
                    forthPrize[info]+=1
                }else{
                    forthPrize[info]=1
                }
            }
            else if(count2 <= 165){
                if(fifthPrize[info]){
                    fifthPrize[info]+=1
                }else{
                    fifthPrize[info]=1
                }
            }
            two = info.substring(info.length-2)
            if(allData[two]){
                allData[two]+=1
            } else{
                allData[two]=1
            }
        }
        resolve()
    });
    });
    })
}
const sort = (list)=>{
    var arr = []
    for (let l in list){
        arr.push([l,list[l]])
    }
    return arr.sort(function(a,b){return b[1]-a[1]})
}
const createCSV = (name,list)=>{
    text = "Lottery Number,Amount\n"
    list.forEach((el)=>{
        text+=el[0]+','+el[1]+"\n";
    }) 
    fs.writeFileSync(`${name}.csv`,text,'utf8')
}
const show = () =>{
    firstPrize = sort(firstPrize)
    firstThreeDigit = sort(firstThreeDigit)
    lastThreeDigit = sort(lastThreeDigit)
    twoDigit = sort(twoDigit)
    secondPrize = sort(secondPrize)
    thirdPrize = sort(thirdPrize)
    forthPrize = sort(forthPrize)
    fifthPrize = sort(fifthPrize)
    allData = sort(allData)
    createCSV("firstPrize",firstPrize)
    createCSV("firstThreeDigit",firstThreeDigit)
    createCSV("lastThreeDigit",lastThreeDigit)
    createCSV("twoDigit",twoDigit)
    createCSV("secondPrize",secondPrize)
    createCSV("thirdPrize",thirdPrize)
    createCSV("forthPrize",forthPrize)
    createCSV("fifthPrize",fifthPrize)
    createCSV("twoDigitAll",allData)
    console.log("First Prize : ")
    console.log(firstPrize)
    console.log("First Three Digit : ")
    console.log(firstThreeDigit)
    console.log("Last Three Digit : ")
    console.log(lastThreeDigit)
    console.log("Two Digit : ")
    console.log(twoDigit)
    console.log("Second Prize : ")
    console.log(secondPrize)
    console.log("Third Prize : ")
    console.log(thirdPrize)
    console.log("Forth Prize : ")
    console.log(forthPrize)
    console.log("Fifth Prize : ")
    console.log(fifthPrize)
    console.log("All two Digit : ")
    console.log(allData)
}
async function print(){
    // for(let i = 0 ;i<index.length;i++){
    //     await getRound(index[i])
    // }
    await show()
}
async function fetchData() {
    var year = 0
    var current = new Date().getFullYear()+543
    for(year = 2533 ; year<=current;year++){
        await getData(year);
    }
    await print();
}
async function main() {
    await fetchData()
}

main()