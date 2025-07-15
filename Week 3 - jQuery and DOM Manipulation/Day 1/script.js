let studentData = [];
let nextId = 1;

// Sayfa yüklendiğinde JSON'dan veriyi çek
$(document).ready(function() {
    $.getJSON('studentData.json', function(data) {
        studentData = data;
        // nextId'yi mevcut en büyük id'ye göre ayarla
        nextId = studentData.length > 0 ? Math.max(...studentData.map(s => s.id)) + 1 : 1;
        displayStudents();
        updateStats();
        setupEventListeners();
    }).fail(function() {
        showError('Öğrenci verisi yüklenemedi!');
        setupEventListeners();
    });
});

function displayStudents() {
    const tbody = $('#studentTableBody');
    tbody.empty();

    if (studentData.length === 0) {
        $('#emptyMessage').show();
        $('#studentTable').hide();
        return;
    }

    $('#emptyMessage').hide();
    $('#studentTable').show();

    studentData.forEach(student => {
        const row = $(`
            <tr data-id="${student.id}">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.grade}</td>
                <td><span class="status-badge ${getStatusClass(student.grade)}">${student.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small delete-btn" data-id="${student.id}">Sil</button>
                    </div>
                </td>
            </tr>
        `);
        tbody.append(row);
    });
}

function getStatusClass(grade) {
    if (grade >= 90) return 'status-excellent';
    if (grade >= 80) return 'status-good';
    if (grade >= 70) return 'status-average';
    return 'status-poor';
}

function updateStats() {
    const totalStudents = studentData.length;
    const averageGrade = totalStudents > 0 ? 
        Math.round(studentData.reduce((sum, student) => sum + student.grade, 0) / totalStudents) : 0;
    
    const classCounts = {};
    studentData.forEach(student => {
        classCounts[student.class] = (classCounts[student.class] || 0) + 1;
    });
    
    const topClass = Object.keys(classCounts).length > 0 ? 
        Object.keys(classCounts).reduce((a, b) => classCounts[a] > classCounts[b] ? a : b) : '-';

    $('#totalStudents').text(totalStudents);
    $('#averageGrade').text(averageGrade);
    $('#topClass').text(topClass);
}

function setupEventListeners() {
    $('#studentForm').on('submit', function(e) {
        e.preventDefault();
        addStudent();
    });

    $(document).on('click', '#studentTableBody tr', function() {
        $('#studentTableBody tr').removeClass('selected');
        $(this).addClass('selected');
    });

    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation();
        const studentId = parseInt($(this).data('id'));
        deleteStudent(studentId);
    });

    $('#studentName, #studentClass, #studentGrade').on('input', function() {
        hideMessages();
    });
}

function addStudent() {
    const name = $('#studentName').val().trim();
    const className = $('#studentClass').val();
    const grade = parseInt($('#studentGrade').val());

    if (!name || !className || isNaN(grade) || grade < 0 || grade > 100) {
        showError('Lütfen tüm alanları doğru şekilde doldurun!');
        return;
    }

    let status = "Orta";
    if (grade >= 90) status = "Mükemmel";
    else if (grade >= 80) status = "Başarılı";
    else if (grade >= 70) status = "Orta";
    else status = "Geliştirilmeli";

    const newStudent = {
        id: nextId++,
        name: name,
        class: className,
        grade: grade,
        status: status
    };

    studentData.push(newStudent);
    displayStudents();
    updateStats();
    $('#studentForm')[0].reset();
    showSuccess(`${name} başarıyla eklendi!`);
}

function deleteStudent(studentId) {
    const student = studentData.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`${student.name} adlı öğrenciyi silmek istediğinizden emin misiniz?`)) {
        studentData = studentData.filter(s => s.id !== studentId);
        displayStudents();
        updateStats();
        showSuccess(`${student.name} başarıyla silindi!`);
    }
}

function showSuccess(message) {
    $('#successMessage').text(message).fadeIn().delay(3000).fadeOut();
}

function showError(message) {
    $('#errorMessage').text(message).fadeIn().delay(3000).fadeOut();
}

function hideMessages() {
    $('#successMessage, #errorMessage').fadeOut();
} 