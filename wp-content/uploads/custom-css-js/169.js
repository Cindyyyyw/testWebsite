<!-- start Simple Custom CSS and JS -->
<script type="text/javascript">
 
var productsIndex;
var productsData;

// Load products and build search index
fetch('/wp-content/uploads/products.json')
    .then(response => response.json())
    .then(data => {
        productsData = data;
        
        // Build Lunr index
        productsIndex = lunr(function () {
            this.ref('id');
            this.field('title');
            this.field('content');
            
            data.forEach(function (doc) {
                this.add(doc);
            }, this);
        });
    });

// Search function
function searchProducts(query) {
    if (!query || !productsIndex) return [];
    
    var results = productsIndex.search(query);
    return results.map(result => {
        return productsData.find(p => p.id == result.ref);
    });
}

// Handle search input
document.getElementById('product-search').addEventListener('input', function(e) {
    var query = e.target.value;
    var results = searchProducts(query);
    displayResults(results);
});

// Display results
function displayResults(results) {
    var resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>没有找到产品</p>';
        return;
    }
    
    var html = '<ul>';
    results.forEach(result => {
        html += `<li><a href="${result.url}">${result.title}</a></li>`;
    });
    html += '</ul>';
    
    resultsContainer.innerHTML = html;
}</script>
<!-- end Simple Custom CSS and JS -->
