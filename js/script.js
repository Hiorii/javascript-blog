/* eslint-disable indent */
/* eslint-disable no-unused-vars */
'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloud: Handlebars.compile(document.querySelector('#template-tag-cloud').innerHTML),
  authorCloud: Handlebars.compile(document.querySelector('#template-author-cloud').innerHTML)
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = 'tags .list',
  optCloudClassCount = 5,
  optCloudClassPrefix  = '.tag-size-';

const titleClickHandler = function(event){
  event.preventDefault();  
  const clickedElement = this; 
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active'); 
  } 
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const hrefClickedLinked = clickedElement.getAttribute('href');  
  const correctArticles = document.querySelector(hrefClickedLinked);
  correctArticles.classList.add('active');    
};  
  
function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML= '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html ='';
  for(let article of articles){    
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);    
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
  let allTags = {};  
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){    
    const tagWrapper = article.querySelector(optArticleTagsSelector);    
    let html = '';   
    const tags = article.getAttribute('data-tags');      
    const splitTagsArray = tags.split(' ');   
    for(let tag of splitTagsArray){    
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);     
      html = html + linkHTML;         
      if(!allTags[tag]){   
        allTags[tag]=1;
      } else {
        allTags[tag]++;
      } 
    }      
    const tagsParams = calculateTagsParams(allTags);      
    tagWrapper.innerHTML = html; 
    const tagList = document.querySelector('.tags');
    const allTagsData = {tags: []};
    for(let tag in allTags){                 
        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams)
        });
      }
    tagList.innerHTML = templates.tagCloud(allTagsData);    
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
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href'); 
  const tag = href.replace('#tag-', ''); 
  const activeTags = document.querySelectorAll('.posts .active');
  for(let activeTag of activeTags){    
    activeTag.classList.remove('active');   
  }
  const tagLinksAsArrticle = document.querySelectorAll('a[href="' + href + '"]');
  for(let tagLinkAsArrticle of tagLinksAsArrticle){
    tagLinkAsArrticle.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]'); 
}

function addClickListenersToTags(){
  const tagLinks = document.querySelectorAll('.post-tags a');  
  const tagCloudLinks = document.querySelectorAll('.tags a');  
  for(let tagLink of tagLinks){
    tagLink.addEventListener('click', tagClickHandler);
  }   
  for(let tagCloudLink of tagCloudLinks){
    tagCloudLink.addEventListener('click', tagClickHandler);
  }  
}

addClickListenersToTags();

function generateAuthors(event){ 
  let allAuthors = {}; 
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    const authorWrapper = article.querySelector('.post-author');    
    let html = '';
    const authors = article.getAttribute('data-author');     
    const splitAuthorsArray = authors.split(' ');          
    for(let author of splitAuthorsArray){      
      const linkHTMLData = {author: author};
      const linkHTML = templates.authorLink(linkHTMLData);
      html = html + linkHTML;
      if(!allAuthors[author]){
        allAuthors[author]=1;
      } else{
        allAuthors[author]++;
      }
    }         
    authorWrapper.innerHTML = html;
    const authorList = document.querySelector('.authors'); 
    let allAuthorsData = {authors: []};
    for(let author in allAuthors){        
        allAuthorsData.authors.push({
          author: author
        });
      }
      authorList.innerHTML = templates.authorCloud(allAuthorsData);
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

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll('.post-author a');
  const authorsList = document.querySelectorAll('.authors a');
  for(let author of authors){
    author.addEventListener('click', authorClickHandler);
  }
  for(let authorList of authorsList){
    authorList.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
