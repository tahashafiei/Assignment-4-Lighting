function sliderReset(name) {
    switch(name) {
        case "lightSliderX":
            g_LightSlider[0].value = 0;
            break;
        case "lightSliderY":
            g_LightSlider[1].value = 17;
            break;
        case "lightSliderZ":
            g_LightSlider[2].value = 0;
            break;          
        default:
            document.getElementById(name).value = 0;
            break;
        }
    
    renderAllShapes();
}