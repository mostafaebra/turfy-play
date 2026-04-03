// 
const SERVERS = {
  dev: "http://turfyplaydev.runasp.net",
  testing: "http://turfytesting.runasp.net",
  wafaa: "http://turfywafaa.runasp.net"
};


const ACTIVE_ENV = "testing"; 

export const BASE_URL = SERVERS[ACTIVE_ENV];