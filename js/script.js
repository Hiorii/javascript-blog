const titleClickHandler = function(event){
    event.preventDefault();
    console.log('Link was clicked!');
    const clickedElement = this;
    console.log(event);
  
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active'); 
 
    for(let activeLink of activeLinks){
         activeLink.classList.remove('active'); 
    }
    /* add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const hrefClickedLinked = clickedElement.getAttribute('href');

    console.log(hrefClickedLinked);
  
    /* find the correct article using the selector (value of 'href' attribute) */
    const correctArticles = document.querySelector(hrefClickedLinked);
    //const correctArticles = document.getElementById(hrefClickedLinked);
    // nie dziala by id bo widzi # z linka???
    console.log(correctArticles);

    /* add class 'active' to the correct article */
    correctArticles.classList.add('active');    
  }
  
  const links = document.querySelectorAll('.titles a');
  
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }