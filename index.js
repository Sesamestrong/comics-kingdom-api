const app = require("express")();
const bodyParser = require("body-parser");
const moment=require("moment");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const getUrl = (title, undTitle, year, month, day, res) => {
    const theDate = new Date(`${year}-${month}-${day}`);
    const isSunday = theDate.getDay() === 0;
    return "https://safr.kingfeatures.com/api/img.php?e=gif&s=c&file=" + btoa(`${title}/${formatNum(year,2)}/${formatNum(month,2)}/${undTitle}${isSunday?"_ntb":""}.${year}${formatNum(month,2)}${formatNum(day,2)}_${res}.${isSunday?"png":"gif"}`);
};
const regex = /([^\/]+)\/\d+\/\d+\/([^.]+)((?:_[^.]+)|)\.(\d{4})(\d{2})(\d{2})_(\d+)\.(.+)$/;
const isSunday = (year, month, day) => moment(`${year}-${month}-${day}`, "YYYY-MM-DD").format("d") == 0;
const formatNum = (num, digits = 2) => num.toString().padStart(digits, "0")
app.post("/getUrl", (req, res) => {
    const {
        base64,
        year,
        month,
        day
    } = req.body;
    const mom = moment(`${year}-${month}-${day}`,"YYYY-MM-DD");
    const [_, name, escName, extension, sampleYear, sampleMonth, sampleDay, size, format] = Buffer(base64, "base64").toString().match(regex);
    const undName = isSunday(sampleYear, sampleMonth, sampleDay) ? escName : escName + extension;
    console.log("un", undName, escName, extension);
    res.json({
        src: Buffer(isSunday(year, month, day) ? `${name}/${year}/${formatNum(month)}/${undName}_ntb.${year}${formatNum(month)}${formatNum(day)}_${size}.png` : `${name}/${year}/${formatNum(month)}/${undName}.${year}${formatNum(month)}${formatNum(day)}_${size}.gif`).toString("base64"),
        previous: mom.subtract(1, "day").format("YYYY-MM-DD"),
        next: mom.add(2, "day").format("YYYY-MM-DD"),
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log("Listening on port " + PORT));
