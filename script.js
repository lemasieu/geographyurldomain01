document.getElementById('submit-button').addEventListener('click', function() {
    const urlInput = document.getElementById('url-input').value;
    const domainOutput = document.getElementById('domain-output');
    const locationOutput = document.getElementById('location-output');
    
    try {
        const url = new URL(urlInput.includes('://') ? urlInput : 'http://' + urlInput);
        const domain = url.hostname;
        const domainParts = domain.split('.');
        const topLevelDomain = '.' + domainParts.pop(); // Tách đuôi miền và thêm dấu chấm

        fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let foundDomain = topLevelDomain; // Đuôi miền
            let foundLocation = ''; // Tên quốc gia, thành phố hoặc châu lục

            // Tìm miền trong phần country
            data.country.forEach(country => {
                if (country.domain.includes(topLevelDomain)) {
                    foundLocation = country.country; // Lưu tên quốc gia
                }
            });

            // Tìm miền trong phần city
            data.city.forEach(city => {
                if (city.domain.includes(topLevelDomain)) {
                    foundLocation = city.city; // Lưu tên thành phố
                }
            });

            // Tìm miền trong phần continent và ưu tiên hiển thị
            data.continence.forEach(continent => {
                if (continent.domain.includes(topLevelDomain)) {
                    foundLocation = continent.continence; // Lưu tên châu lục nếu tìm thấy
                }
            });

            // Cập nhật ô tên miền
            if (domainOutput) domainOutput.value = foundDomain || 'Không tìm thấy';

            // Cập nhật ô địa danh với tên đã tìm thấy
            if (locationOutput) {
                locationOutput.value = foundLocation || 'Không tìm thấy';
            }
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            if (locationOutput) locationOutput.value = 'Lỗi khi tải dữ liệu';
        });
    } catch (error) {
        console.error('Invalid URL:', error);
        if (locationOutput) locationOutput.value = 'URL không hợp lệ';
    }
});