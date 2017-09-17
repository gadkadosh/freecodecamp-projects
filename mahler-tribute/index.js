const cycleQuote = (index = 0) => {
    numQuotes = $(".blockquote").length
    if (index >= numQuotes) index = 0
    
    $(".blockquote").eq(index).fadeIn(800, () => {
        $(".blockquote").eq(index).delay(2500).fadeOut(800, () => {
            cycleQuote(index + 1)
        })
    })
}
  
$(document).ready(() => {
    $(".blockquote").hide()
    cycleQuote()
})