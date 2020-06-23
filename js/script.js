/* eslint-disable indent */
/* eslint-disable no-unused-vars */
'use strict';

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

  /* add class 'active' to the correct article */
  correctArticles.classList.add('active');    
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = 'tags .list',
  optCloudClassCount = 5,
  optCloudClassPrefix  = '.tag-size-';

  function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML= '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html ='';
  for(let article of articles){      
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */    
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';    
    

    /* insert link into titleList */
    html = html + linkHTML;    
  }
  titleList.innerHTML = html;
    
  const links = document.querySelectorAll('.titles a');
  
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){  
  let params = {max: '0', min: '999999'};  
  for(let tag in tags){ 
    //console.log(tag + ' is used ' + tags[tag] + ' times.');    
    if(tags[tag]>params.max){      
      params.max = tags[tag];      
    }
    if(tags[tag]<params.min){
      params.min = tags[tag];     
    }
  }   
  return params;
}

function generateTags(){
   /* [NEW] create a new variable allTags with an empty object */
   let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags');    
    /* split tags into array */
    const splitTagsArray = tags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of splitTagsArray){    
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '&nbsp;&nbsp;</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;     
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
        allTags[tag]=1;
      } else {
        allTags[tag]++;
      } 
    }      
    const tagsParams = calculateTagsParams(allTags);  
    //console.log('tagsParams:', tagsParams);  
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    /* [NEW] create variable for all links HTML code */
    
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      //console.log(allTags, allTags[tag]);
        /* [NEW] generate code of a link and add it to allTagsHTML */
        const tagLinkHTML = '<li><a href="#tag-' + tag + '" class ="tag-size-' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';     
        allTagsHTML += tagLinkHTML;
      }
    tagList.innerHTML = allTagsHTML;
  }
}

function calculateTagClass(count, params){     
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return classNumber;
}


generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href'); 
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', ''); 
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('.posts .active');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){    
    activeTag.classList.remove('active');   
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksAsArrticle = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLinkAsArrticle of tagLinksAsArrticle){
    tagLinkAsArrticle.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
  /* execute function "generateTitleLinks" with article selector as argument */
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.post-tags a');  
  const tagCloudLinks = document.querySelectorAll('.tags a'); 
  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
    tagLink.addEventListener('click', tagClickHandler);
  }   
  for(let tagCloudLink of tagCloudLinks){
    tagCloudLink.addEventListener('click', tagClickHandler);
  }  
}

addClickListenersToTags();

function generateAuthors(event){  
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const authorWrapper = article.querySelector('.post-author');    
    let html = '';
    const author = article.getAttribute('data-author');     
    const authorLink = '<p><a href="#author-' + author + '">by ' + author + '</p>';
    html = html + authorLink;
    authorWrapper.innerHTML = html;
  }
}

generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;  
  const href = clickedElement.getAttribute('href');  
  const author = href.replace('#author-','');
  const activeAuthors = document.querySelectorAll('.posts .active');
  for(let activeAuthor of activeAuthors){
    activeAuthor.classList.remove('active');
  }
  const authorLinkAsInArticles = document.querySelectorAll('a[href="' + href + '"]');
  for(let authorLinkAsInArticle of authorLinkAsInArticles){
    authorLinkAsInArticle.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthorss(){
  const authors = document.querySelectorAll('.post-author a');
  for(let author of authors){
    author.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthorss();
