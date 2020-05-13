// 환경 설정
var cityCode = "강원도";
var districtCode = "화천군";
var localWebDriver = "http://localhost:9515";

const webdriver = require("selenium-webdriver");

const driver = new webdriver.Builder()
  .usingServer(localWebDriver)
  .forBrowser("chrome")
  .build();
const By = webdriver.By;

const url = "https://www.zeropay.or.kr/main.do?pgmId=PGM0081";

var tableData = [];

var firstPreBtnCheck = true;

driver.get(url).then((res) => {
  onSelectAreaCode(cityCode, districtCode, () => {
    onClickCheckButton();
  });
});

var onSelectAreaCode = function (cityCode, districtCode, cb) {
  driver.findElement(By.id("tryCode")).then((select) => {
    select.click().then((_) => {
      select.sendKeys(cityCode);
      driver.findElement(By.id("skkCode")).then((select) => {
        select.click().then((_) => {
          select.sendKeys(districtCode);
          cb();
        });
      });
    });
  });
};

var onClickCheckButton = function () {
  driver.findElement(By.className("btn-agree")).then((v) => {
    v.click().then(() => {
      tableScan();
    });
  });
};

var tableScan = () => {
  tableData = [];
  setTimeout(() => {
    driver.findElement(By.className("mw_table800")).then((res) => {
      res.findElement(By.tagName("tbody")).then((els) => {
        els.findElements(By.tagName("tr")).then((resTr) => {
          var scanRow = (row, num) => {
            if (row[num]) {
              row[num].findElements(By.tagName("td")).then((resTd) => {
                var store = {};
                resTd[0].getText().then((resText) => {
                  store.name = resText;
                  resTd[1].getText().then((resText) => {
                    store.address = resText;
                    resTd[2].getText().then((resText) => {
                      store.type = resText;
                      tableData.push(store);
                      num++;
                      scanRow(row, num);
                    });
                  });
                });
              });
            } else {
              sendToDB(tableData);
              nextTable();
            }
          };
          var i = 0;

          scanRow(resTr, i);
        });
      });
    });
  }, 1000);
};

var nextTable = () => {
  driver.findElement(By.id("list_pager")).then((pager) => {
    pager.findElement(By.tagName("span")).then((span) => {
      span.findElements(By.tagName("a")).then((buttonArr) => {
        var checkButton = (i) => {
          buttonArr[i].getAttribute("class").then((res) => {
            if (res == "on") {
              i++;
              if (i < buttonArr.length) {
                buttonArr[i].click().then(() => {
                  tableScan();
                });
              } else {
                driver
                  .findElements(By.className("pre_page"))
                  .then((button) => {
                    if (button.length == 1 && firstPreBtnCheck) {
                      firstPreBtnCheck = false;

                      button[button.length - 1].click().then(() => {
                        tableScan();
                      });
                    } else if (button.length == 2) {
                      button[button.length - 1].click().then(() => {
                        tableScan();
                      });
                    } else {
                      crawlingEnd();
                    }
                  })
                  .catch(() => {
                    console.log("END");
                  });
              }
            } else {
              i++;
              checkButton(i);
            }
          });
        };
        checkButton(0);
      });
    });
  });
};

var nextPager = () => {};

var sendToDB = (params) => {
  // send to DB
  console.log(params);
};

var crawlingEnd = () => {
  // crawling end
  console.log("END");
};
