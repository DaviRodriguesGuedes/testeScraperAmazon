document.getElementById('search').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    if (!keyword) return alert('Please enter a keyword');
    
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    
    document.getElementById('results').innerHTML = data.map(product => `
        <div class="product">
            <img src="${product.imageUrl}" alt="Product Image">
            <h2>${product.title}</h2>
            <p>Rating: ${product.rating}</p>
            <p>Reviews: ${product.reviews}</p>
        </div>
    `).join('');
});
