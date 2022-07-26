const form = document.querySelector('form');
form.addEventListener('submit',async (e)=> {
  e.preventDefault();
  const [
    {value: email}, 
    {value: password}
  ] = e.target;

  const token = await getToken({ email, password });
  const data = await getPhotos(token);

  fillData(data);
  const [login, table, btns] = document.querySelectorAll('#instaLogin, #instaPics, #buttons');
  login.classList.toggle('d-none');
  table.classList.toggle('d-none');
  btns.classList.toggle('d-none');

  localStorage.setItem('page', 1);

})

const getToken = async (user)=>{
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  const {token} = await response.json();
  localStorage.setItem('token', token);
  return token;
};

const getPhotos = async(token, page)=>{
  const response = await fetch(`http://localhost:3000/api/photos?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/jason',
      Authorization: `Bearer ${token}`
    }
  });
  const {data} = await response.json();
  console.log(data)
  return data;
};

const fillData = (data) => {
  console.log(data)

  const template = data.map(({ download_url, author }) => {
    console.log(download_url, author)
    return  `
<div class="card-body">
      <h5 class="card-title"></h5>
      </div>
      <div class="col-12 col-lg-3 mt-4">
    <div class="card">
      <img class="card-img-top" src="${download_url}" alt="Card image cap">
      <div class="card-body">
      <h5 class="card-title">${author}</h5>
      </div>
    </div>
    </div>
       `;
    });
    document.querySelector('#instaPics').innerHTML = template.join('');

}

document.getElementById("next").addEventListener("click", async () => {
  const token = localStorage.getItem('token');
  const page = Number(localStorage.getItem('page'))+1;
  localStorage.setItem('page', page);
  console.log(page)
  const dataPhotos = await getPhotos(token,page);

  fillData(dataPhotos);
});

( async()=>{
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
    const page = localStorage.getItem('page');
    const dataPhotos = await getPhotos(token,page);
    fillData(dataPhotos);
    const [login, table, btns] = document.querySelectorAll('#instaLogin, #instaPics, #buttons');
    login.classList.toggle('d-none');
    table.classList.toggle('d-none');
    btns.classList.toggle('d-none');
  }
})();

document.getElementById("cerrarInstafake").addEventListener("click", event => {
  event.preventDefault;
  localStorage.clear();
  location.reload();
})