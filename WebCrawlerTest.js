// Selenium API 사이트
//https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html

// 관련 블로그
// https://www.bsidesoft.com/?p=2209

const webdriver = require("selenium-webdriver");

const driver = new webdriver.Builder()
  .usingServer("http://localhost:9515")
  .forBrowser("chrome")
  .build();
const By = webdriver.By;

const url = "https://www.zeropay.or.kr/main.do?pgmId=PGM0081";

var tableData = [];

driver.get(url).then((res) => {
  onSelectAreaCode("부산광역시", "동래구", () => {
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
      setTimeout(() => {
        tableScan(() => {
          sendToDB(tableData);
          nextTable();
        });
      }, 1000);
    });
  });
};

var tableScan = (nextFunc) => {
  tableData = [];
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
            nextFunc();
          }
        };
        var i = 0;

        scanRow(resTr, i);
      });
    });
  });
};

var nextTable = () => {
  driver.findElement(By.id("list_pager")).then((pager) => {
    pager.findElement(By.tagName("span")).then((span) => {
      span.findElements(By.tagName("a")).then((buttonArr) => {
        var checkButton = (i) => {
          buttonArr[i].getAttribute("class").then((res) => {
            if (res == "on") {
              console.log(i);
              i++;
              if (i < buttonArr.length) {
                buttonArr[i].click().then(() => {
                  setTimeout(() => {
                    tableScan(() => {
                      sendToDB(tableData);
                      nextTable();
                    });
                  }, 1000);
                });
              } else {
                console.log("NEXT PAGE");
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

var sendToDB = (params) => {
  // send to DB
  console.log(params);
};
