
const allowedPath = "index"; 


window.addEventListener('popstate', (e) => {
  if (location.pathname !== allowedPath) {
    history.replaceState(null, "", allowedPath);
    alert("Переход запрещён!");
  }
});


history.replaceState(null, "", allowedPath);
if (location.pathname !== "/index") {
  location.replace("/index"); 
}