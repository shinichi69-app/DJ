-- Create database
CREATE DATABASE IF NOT EXISTS employee_directory;
USE employee_directory;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_name (first_name, last_name)
);

-- Insert sample data
INSERT INTO employees (first_name, last_name, position, department, email, phone, bio) VALUES
('สมชาย', 'ใจดี', 'นักพัฒนา Frontend', 'พัฒนาเว็บ', 'somchai@company.com', '081-234-5678', 'ผู้เชี่ยวชาญด้าน React และ Vue.js มีประสบการณ์ 5 ปี'),
('สาวิกา', 'รักเรียน', 'นักพัฒนา Backend', 'พัฒนาเว็บ', 'savika@company.com', '082-345-6789', 'ผู้เชี่ยวชาญด้าน Node.js และ Python'),
('วิศรุต', 'ศิลป์', 'นักออกแบบ UI/UX', 'ดีไซน์', 'wisarut@company.com', '083-456-7890', 'มีประสบการณ์ด้าน UX Design 7 ปี'),
('นภา', 'ตะวัน', 'ผู้จัดการฝ่ายการตลาด', 'การตลาด', 'napa@company.com', '084-567-8901', 'ผู้เชี่ยวชาญด้านการตลาดดิจิทัลและการสร้างแบรนด์'),
('กิตติ', 'สกุลดี', 'หัวหน้าแผนกพัฒนา', 'บริหาร', 'kitti@company.com', '085-678-9012', 'หัวหน้าทีมพัฒนาด้วยประสบการณ์ 10 ปี'),
('วรินทร์', 'ใจกว้าง', 'นักวิเคราะห์ข้อมูล', 'พัฒนาเว็บ', 'warin@company.com', '086-789-0123', 'ผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและ BI'),
('นุชนาฏ', 'งามศิลป์', 'นักออกแบบกราฟิก', 'ดีไซน์', 'nuchanat@company.com', '087-890-1234', 'มีประสบการณ์ด้านกราฟิกดีไซน์ 4 ปี'),
('พงศกร', 'มั่งมี', 'ผู้จัดการฝ่ายขาย', 'ฝ่ายขาย', 'pongsakorn@company.com', '088-901-2345', 'ผู้เชี่ยวชาญด้านการขาย B2B และการบริหารทีมขาย');