export function orderArr(arr) {
  if (Array.isArray(arr))
    arr.sort((a, b) => {
      return a.id - b.id;
    });
  return arr;
}

export function mockTime(date_1, distenceDate) {
  if (!date_1) return null;
  const currentTime = new Date();
  const fixDate = new Date(date_1);
  const target = fixDate > currentTime ? currentTime : fixDate;
  const distance = new Date(distenceDate + " 00:00");
  distance.setHours(target.getHours());
  distance.setMinutes(target.getMinutes());
  distance.setSeconds(target.getSeconds());

  let y, m, d, h, mm, s;
  y = distance.getFullYear();
  m = "0" + (distance.getMonth() + 1);
  d = "0" + distance.getDate();
  h = "0" + target.getHours();
  mm = "0" + target.getMinutes();
  s = "0" + target.getMinutes();
  const newDate = new Date(
    `${y}-${m.slice(-2)}-${d.slice(-2)}T${h.slice(-2)}:${mm.slice(
      -2
    )}:${s.slice(-2)}`
  );
  return newDate.toISOString();
}

export function fmtDate(dateExp) {
  if (dateExp) {
    const dateTimeArr = dateExp.split(/[\s-T:.]/);
    const [y, m, d, h, mm, s] = dateTimeArr;
    const tmpDate = new Date(
      Date.UTC(
        parseInt(y),
        parseInt(m) - 1,
        parseInt(d),
        parseInt(h),
        parseInt(mm),
        parseInt(s)
      )
    );
    return tmpDate.toLocaleString();
  }
  return "";
}
export function setCookie(cookies, exp = 8) {
  const curTime = new Date();
  const exHours = exp;
  const expires = new Date(curTime.getTime() + exHours * 60 * 60 * 1000);
  var expireStr = `expires=${expires.toUTCString()}`;
  for (const [key, value] of Object.entries(cookies)) {
    document.cookie = `${key}=${value};${expireStr}`;
  }
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function isLogin() {
  const logStatus = getCookie("username");
  return logStatus !== "" ? true : false;
}
export function clearCookie() {
  const ex = new Date(317451600000);
  const exp = `expires=${ex.toUTCString()}`;
  const cookies = ["username", "accessToken", "idToken"];
  cookies.forEach((ele) => {
    document.cookie = `${ele}=;${exp}`;
  });
}
export function logout() {
  clearCookie();
}
export function fmtDT(dtObj) {
  return `${dtObj.getFullYear()}-${("0" + (dtObj.getMonth() + 1)).slice(-2)}-${(
    "0" + dtObj.getDate()
  ).slice(-2)}T${("0" + dtObj.getHours()).slice(-2)}:${(
    "0" + dtObj.getMinutes()
  ).slice(-2)}`;
}
export function fmtToUTCString(dateTime) {
  if (!dateTime) return null;
  const tmp = dateTime.split(/[-T:]/);
  const tmp2 = new Date(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4]);
  return `${tmp2.getUTCFullYear()}-${("0" + tmp2.getUTCMonth()).slice(-2)}-${(
    "0" + tmp2.getUTCDate()
  ).slice(-2)}T${("0" + tmp2.getUTCHours()).slice(-2)}:${(
    "0" + tmp2.getUTCMinutes()
  ).slice(-2)}:00`;
}
export function fetchPathBuilder(
  basePath,
  size,
  page,
  order,
  sortby,
  containerNum,
  confidenceRange = [0, 100],
  lockat,
  unlockat
) {
  let rst = basePath;
  const rqtPage = parseInt(page, 10) + 1;
  const lockDT = fmtToUTCString(lockat);
  const unlockDT = fmtToUTCString(unlockat);
  rst = `&pageSize=${size}&page=${rqtPage}&order_by=${order}&sort=${sortby.toUpperCase()}`;
  if (containerNum) rst += `&code=${containerNum}`;
  if (lockDT) rst += `&lockTime_gte=${lockDT}`;
  if (unlockDT) rst += `&unlockTime_lte=${unlockDT}`;
  return rst;
}
