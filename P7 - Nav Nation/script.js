const menuBars = document.getElementById('menu-bars');
const overlay = document.getElementById('overlay');
const nav1 = document.getElementById('nav-1');
const nav2 = document.getElementById('nav-2');
const nav3 = document.getElementById('nav-3');
const nav4 = document.getElementById('nav-4');
const nav5 = document.getElementById('nav-5');
const navItems = [nav1, nav2, nav3, nav4, nav5];

// vid-79

function navAnimation(dir1, dir2) {
    navItems.forEach((element, i) => { 
        element.classList.replace(`slide-${dir1}-${i+1}`, `slide-${dir2}-${i+1}`);
    });
}

function toggleNav() {
    // menu bars open/close
    menuBars.classList.toggle('change');
    // menu active
    overlay.classList.toggle('overlay-active');
    if (overlay.classList.contains('overlay-active')) {
        overlay.classList.replace('overlay-slide-left', 'overlay-slide-right')
        // animate in nav items
        navAnimation('out', 'in');
    } else {
        overlay.classList.replace('overlay-slide-right', 'overlay-slide-left')
        // animate out nav items
        navAnimation('in', 'out');
    }    
}

menuBars.addEventListener('click', toggleNav);
navItems.forEach((nav) => {
    nav.addEventListener('click', toggleNav);
})