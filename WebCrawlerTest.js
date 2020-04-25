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

driver.get(url).then((res) => {
  onSelectAreaCode("부산광역시", "동래구", () => {
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

  driver.findElement(By.className("btn-agree")).then((v) => {
    console.log("find");
    v.click().then((undefi) => {
      console.log("click");
      setTimeout(() => {
        tableScan();
      }, 1000);
    });
  });
};

var tableScan = function () {
  driver.findElement(By.className("mw_table800")).then((res) => {
    res.findElement(By.tagName("tbody")).then((els) => {
      els.findElements(By.tagName("tr")).then((resTr) => {
        for (var i in resTr) {
          resTr[i].findElements(By.tagName("td")).then((resTd) => {
            var store = {};
            resTd[0].getText().then((resText) => {
              store.name = resText;
              if (store.name && store.address && store.type) {
                console.log(store);
              }
            });
            resTd[1].getText().then((resText) => {
              store.address = resText;
              if (store.name && store.address && store.type) {
                console.log(store);
              }
            });
            resTd[2].getText().then((resText) => {
              store.type = resText;
              if (store.name && store.address && store.type) {
                console.log(store);
              }
            });
          });
        }
      });
    });
  });
};
