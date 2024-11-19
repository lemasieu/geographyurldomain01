document.getElementById('submit-button').addEventListener('click', function() {
    const urlInput = document.getElementById('url-input').value;
    const domainOutput = document.getElementById('domain-output');
    const locationOutput = document.getElementById('location-output');

    // Lấy tên miền từ URL
    const url = new URL(urlInput.includes('://') ? urlInput : 'http://' + urlInput);
    const domain = url.hostname;
    
    // Đọc data.json
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let foundDomain = '';
        let foundLocation = '';

        // Tìm miền trong danh sách
        const domainParts = domain.split('.');
        const topLevelDomain = domainParts[domainParts.length - 1];
        
        // Kiểm tra miền từ file data.json
        data.country.forEach(country => {
            if (country.domain.includes(`.${topLevelDomain}`)) {
                foundDomain = `.${topLevelDomain}`;
                foundLocation = country.country;
            }
        });

        // Kiểm tra thành phố
        data.city.forEach(city => {
            if (domain.includes(city.domain[0].substring(1))) {
                foundLocation = city.city;
            }
        });

        // Cập nhật kết quả
        domainOutput.value = foundDomain;
        locationOutput.value = foundLocation ? foundLocation : 'Không tìm thấy';
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
        locationOutput.value = 'Lỗi khi tải dữ liệu';
    });
});