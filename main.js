let news = []
let page = 1
let total_pages = 0
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event)))
let searchButton = document.getElementById("search-button")
let url

const getNews = async () => {
    try {
        let header = new Headers({ 'x-api-key': process.env.NEWS_API_KEY })
        url.searchParams.set("page", page);
        console.log(url)
        let response = await fetch(url, { headers: header })
        let data = await response.json()
        if (response.status == 200) {
            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다")
            }
            news = data.articles
            total_pages = data.total_pages
            page = data.page
            render()
            pageNation()
        } else {
            throw new Error(data.message)
        }
    } catch (error) {
        console.log("잡힌 에러는", error.message)
        errorRender(error.message)
    }
}
const getLatestNews = async () => {
    url = new URL("https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10")
    getNews()
}

const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase()
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`)
    getNews()

}

const getNewsByKeyword = async () => {
    let keyword = document.getElementById("search-input").value
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
    getNews()
}

const render = () => {
    let newsHTML = ''
    newsHTML = news.map(item => {
        return ` <div class="row news">
        <div class="col-lg-4">
            <img class="news-image-size" src="${item.media}" />
        </div>
        <div class="col-lg-8">
            <h2>
             ${item.title}
            </h2>
            <p>
             ${item.summary}
            </p>
            <div>
                ${item.rights} * ${item.published_date}
            </div>

        </div>
    </div>`
    }).join('')
    document.getElementById("news-board").innerHTML = newsHTML
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
    document.getElementById("news-board").innerHTML = errorHTML
}
const pageNation = () => {
    let pagenationHTML = `
    `
    let pageGroup = Math.ceil(page / 5)
    let last = pageGroup * 5
    if (last > total_pages) {
        last = total_pages
    }
    let first = last - 4 <= 0 ? 1 : last - 4 // 첫 그룹이 5이하이면
    if (first >= 6) {
        pagenationHTML = `<li class="page-item"> 
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)"> <span aria-hidden="true">&lt;&lt;</span></a> 
        </li>
        <li class="page-item"> 
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})"> <span aria-hidden="true">&lt;</span> </a> 
        </li>`
    }

    //total page 3일 경우 3개의 페이지만 프린트 하는 법 last, first
    //<< >> 버튼 만들어주기 맨처음 맨 끝으로 가는 버튼 만들기
    // 내가 그룹1일때 << 이 버튼이 없다
    // 내가 마지막 그룹일 때 >> 이 버튼이 없다.
    for (let i = first; i <= last; i++) {
        pagenationHTML += `<li class="page-item"><a class="page-link ${page == i ? "active" : ""}" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }
    if (last < total_pages) {
        pagenationHTML += `
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
    <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
      <span aria-hidden="true">&gt;&gt;</span>
    </a>
  </li>`
    }

    document.querySelector(".pagination").innerHTML = pagenationHTML
}

const moveToPage = (pageNum) => {
    page = pageNum
    console.log(page)
    getNews()
}
getLatestNews()
searchButton.addEventListener("click", getNewsByKeyword)


//페이지 네이션 = 그룹숫자 * 5
