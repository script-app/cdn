     window.addEventListener("load", function () {
        if (!sessionStorage.getItem("splash")) {
            waiting()
            setTimeout(() => {
                Swal.close();
                welcome()
            }, 3000)
            sessionStorage.setItem("splash", "true");
        }
    });

    waiting()
    function waiting() {
        Swal.fire({ title: 'กำลังโหลดข้อมูล..!!' });
        Swal.showLoading();
        setTimeout(() => {
            Swal.close();
        }, 3000)
    }
    //<-- -----------------------------------------โหลดข้อมูลผู้ใช้มาเก็บไว้ก่อน -->
    var datalogin, scripturl
    google.script.run.withSuccessHandler((result) => {
        datalogin = result

        // console.log(datalogin)
    }).searchData('user')

    //<-- -----------------------------------------สคริปต์รีโหลดหน้าเว็บ -->
    google.script.run.withSuccessHandler(function (url) {
        scripturl = url
    }).getURL();

    //<-- -------------------------------------กรณีที่มีการรีโหลดหน้าเว็บ ให้มาเช็คข้อมูลจาก sessionStorage
    let status, name, user_save, token, adminLogin
    window.addEventListener('load', function () {

        status = sessionStorage.getItem("Status");
        name = sessionStorage.getItem("Name");
        datauser = sessionStorage.getItem("Datauser");
        console.log('สถานะ ' + status)
        // notification(name)
        if (status === null) {

            $('#nav-btn3').addClass('d-none')
            google.script.run.withSuccessHandler(searchData).searchData('data')
        } else if (status == "admin") {
            //waiting()
            showUserTable({ name: false, admin: true })
            $('#logoutbtn').show()
            $('#loginbtn').hide()
            $('#nameAdmin').text(name)
            $('#showname').show()
            $('#sendbtn').show()
            $('#commandbtn').show()
            $('#announcebtn').show()

            // <-- ------------------------------ปุ่มเรียกฟอร์ม -->
            $('#nav-btn').removeClass('d-none')
            $('#nav-btn2').addClass('d-none')
            $('#nav-btn3').removeClass('d-none')
            console.log('ผู้เข้าระบบ ชื่อ ' + name)
        } else {
            //waiting()
            $('#nav-btn').addClass('d-none')
            $('#nav-btn2').removeClass('d-none')
            $('#nav-btn3').removeClass('d-none')
            google.script.run.withSuccessHandler((result) => {
                dataSend = result
                showUserTable({ name: name })
                $('#logoutbtn').show()
                $('#loginbtn').hide()
                $('#nameAdmin').text(name)
                $('#showname').show()
                $('#addbtn').hide()
                $('#sendbtn').hide()
                $('#commandbtn').hide()
                $('#announcebtn').hide()
                $('#recordbtn').show() //ปุ่มเมนูบันทึกข้อความ
                console.log('ผู้เข้าระบบ ชื่อ ' + name)

            }).searchDataSend(name)

        }
    })

    //<-- ------------------------------------ปุ่มรับหนังสือภายนอก -->
    $('#nav-btn').click(function () {
        addform1()
    })

    //<-- ------------------------------------ปุ่มเพิ่มหนังสือบันทึก -->
    $('#nav-btn2').click(function () {
        addform5()
    })

    //<-- ------------------------------------ฟอร์ม Logout -->
    function logout() {
        Swal.fire({
            position: 'top',
            title: 'คุณต้องการออกจากระบบ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง'

        }).then((result) => {

            if (result.isConfirmed) {
                reLoad()
                Swal.fire({ title: 'กำลังออกจากระบบ..' });
                Swal.showLoading();

                sessionStorage.removeItem("Status");
                sessionStorage.removeItem("Name");
                sessionStorage.removeItem("Datauser");
            }
        })
    }

    //<-- ------------------------------------ฟอร์ม Login -->
    function loginform() {
        Swal.fire({
            title: 'ลงชื่อเข้าใช้งาน',
            html: `<input type="text" id="user" class="swal2-input" placeholder="ชื่่อผู้ใช้"><input type="password" id="pass" class="swal2-input" placeholder="รหัสผ่าน">`,
            confirmButtonText: 'ตกลง',
            showCancelButton: true,
            confirmButtonColor: '#0D6EFD',
            cancelButtonColor: '#FE703D',
            denyButtonText: 'No',
            focusConfirm: true,
            preConfirm: () => {

                const user = Swal.getPopup().querySelector('#user').value
                const pass = Swal.getPopup().querySelector('#pass').value
                let rowindex = datalogin.filter(r => r[4] == user && r[5] == pass)

                if (!user || !pass) {
                    Swal.showValidationMessage(`กรุณากรอกข้อมูลให้ครบ`)
                } else {
                    if (rowindex != "") {
                        console.log('ชื่อผู้เข้าสู่ระบบ คือ ' + rowindex[0][1] + 'สถานะเป็น ' + rowindex[0][6])

                        user_save = rowindex[0][1]

                        $('#nameAdmin').text(rowindex[0][1])
                        $('#showname').show()
                        $('#logoutbtn').show()
                        $('#sendbtn').show()
                        $('#commandbtn').show()
                        $('#announcebtn').show()
                        $('#recordbtn').show() //เมนู sidebar บันทึกข้อความ
                        $('#loginbtn').hide()
                        $('#homebtn').addClass('active');
                        adminLogin = rowindex[0][6]
                        sessionStorage.setItem("Status", rowindex[0][6]);
                        sessionStorage.setItem("Name", rowindex[0][1]);
                        Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'ลงชื่อเข้าใช้สำเร็จ!!!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            Swal.close();
                            waiting()
                        }, 1000)
                        // notification(rowindex[0][1])
                        $('#nav-btn3').removeClass('d-none')
                        //<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น Admin -->
                        if (rowindex[0][6] == 'admin') {
                            $('#nav-btn').removeClass('d-none')
                            $('#nav-btn2').addClass('d-none')
                            $('#nav-btn-c').addClass('d-none')

                            // waiting()
                            //    $('#nav-btn').text('เพิ่มข้อมูล').attr('data-form', 'formAdd').removeClass('d-none')
                            showUserTable({ name: rowindex[0][1], admin: true })
                            console.log('data ' + rowindex[0][1])
                        } else {
                            $('#nav-btn').addClass('d-none')
                            $('#nav-btn2').removeClass('d-none')
                            $('#nav-btn-c').addClass('d-none')
                            $('#addbtn').hide()
                $('#sendbtn').hide()
                $('#commandbtn').hide()
                $('#announcebtn').hide()
                $('#recordbtn').show() //ปุ่มเมนูบันทึกข้อความ
                name = rowindex[0][1]
                            // waiting()
                            //<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น User -->
                            google.script.run.withSuccessHandler((result) => {
                                dataSend = result
                                showUserTable({ name: rowindex[0][1], admin: false })
                                console.log('name คือ ' + rowindex[0][1])
                
                            }).searchDataSend(name)
                        }
                    } else {
                        Swal.close()
                        Swal.fire({
                            position: 'top',
                            icon: 'error',
                            title: 'คุณใส่รหัสผ่านไม่ถูกต้อง',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            }
        })
    }

    //<-- -----------------------------แแสดงตาราง -->
    function showUserTable({ name, admin }) {
        if (admin) {
            $('#table1').show() //แสดงตารางหนังสือรับ
            $('#table2').hide()
            $('#table3').hide()
            $('#table4').hide()
            $('#table5').hide()
            $('#table6').hide()
            $('#recordbtn').hide()
            $('#homebtn').addClass('active');
            google.script.run.withSuccessHandler(searchData).searchData('data')
            return

        } else {
            if (!dataSend || !dataSend2) {
                setTimeout(() => {
                    showUserTable({ name })
                }, 200)
                return
            }
            $('#table1').hide() //แสดงตารางทั้งหมด
            $('#table2').show()
            $('#table3').hide() //ซ่อนตารางหนังสือส่ง
            $('#table4').hide() //ซ่อนตารางคำสั่ง
            $('#table5').hide() //ซ่อนตารางประกาศ
            $('#homebtn').hide() // -----------------------ซ่อนปุ่ม home ถ้า user login เข้ามา
            $('#bookinbtn').show() // ------------------ แสดงปุ่มหนังสือภายใน ------>
            $('#bookinbtn').addClass('active');

            let rowdata = dataSend.filter(r => r[13] == name) //ค้นหาข้อมูลตามชื่อที่แทงหนังสือในชีต send คอลัมน์ที่ 13
            searchDataS(rowdata) //เรียกฟังก์ชั่นไปค้นหาข้อมูลเพื่อแสดงตาราง tableSend ของแต่ละกอง ที่ login เข้ามา

            let rowdata2 = dataSend2.filter(r => r[7] == name) //ค้นหาข้อมูลตามชื่อผู้ปฏิบัติในชีต บันทึก คอลัมน์ที่ 7
            searchDataS2(rowdata2)
            showUserTable
            sessionStorage.setItem("Datauser", rowdata);
            //console.log(rowdata)
            $('#addbtn').hide()
            $('#sendbtn').hide()
            $('#commandbtn').hide()
            $('#announcebtn').hide()
            $('#table6').hide()
        }
    }
    //searchData
    //<-- --------------------------------------รีโหลดเว็บ -->
    function reLoad() {
        window.open(scripturl, '_top');
    }

    //<-- --------------------------------------โหลด -->
    function loadBookIn() {
        Swal.fire({ title: 'รอสักครู่..กำลังโหลดข้อมูล' });
        Swal.showLoading();
        reLoad()
    }

    //<-- --------------------------------------แสดงฟอร์ม Modal หนังสือรับ -->
    function addform1() {
        event.preventDefault();
        setForm('add', 'ฟอร์มหนังสือรับ')
        toggleFormInput(false)
        $('#modal_form1').modal('show')
        // $('#addbtn').removeClass('hide');
        // $('#addbtn').addClass('active');
    }

    //<-- --------------------------------------แสดงฟอร์ม Modal หนังสือส่ง -->
    function addform2() {
        event.preventDefault();
        setForm('send', 'ฟอร์มหนังสือส่ง')
         toggleFormInput(false)
        $('#closeModal1').click()
        $('#modal_form1').modal('show')
    }

    //<-- ----------------------------------แสดงฟอร์ม Modal หนังสือส่งคำสั่ง -->
    function addform3() {
        event.preventDefault();
        setForm('command', 'ฟอร์มคำสั่ง')
        $('#closeModal1').click()
        toggleFormInput(['#input1', '#input3', '#input4'])
        $('#modal_form1').modal('show')
    }

    //<-- -----------------------------------แสดงฟอร์ม Modal หนังสือประกาศ -->
    function addform4() {
        event.preventDefault();
        setForm('announce', 'ฟอร์มประกาศ')
        $('#closeModal1').click()
        toggleFormInput(['#input1', '#input3', '#input4'])
        $('#modal_form1').modal('show')
    }

    //<-- ------------------------------แสดงฟอร์ม Modal หนังสือบันทึกข้อความ -->
    function addform5() {
        event.preventDefault();
        setForm('record', 'ฟอร์มบันทึกข้อความ')
        toggleFormInput(false)
        $('#closeModal1').click()
        $('#modal_form1').modal('show')
    }

    //<-- ------------------------------แสดงชื่อฟอร์ม -->
    function setForm(target, title) {
        $('#targetFunc').val(target)
        $('#form-title').text(title)
    }

    //<-- ------------------------------แสดงตาราง -->
    function toggleTable(table) {
        $('#table1,#table2,#table3,#table4,#table5,#table6').hide()
        $(table).show()
    }

    //<-- ------------------------------แสดง/ซ่อน Input -->
    function toggleFormInput(inputs) {
        $('input, select, textarea').not('[type="file"]').not('.hide').prop('required', true)
        $('.ishide').removeClass('ishide').show()
        if (!inputs) return
        $(inputs.join(',')).each(function () {
            $(this).prop('required', false).parent().addClass('ishide').hide()
            $('label[for="' + $(this).attr('id') + '"]').addClass('ishide').hide()
        })
    }

    //<-- -----------------------------------------แสดงตารางหนังสือส่ง -->
    function showTableDataPost() {
        event.preventDefault();
        toggleTable('#table3')
        $('#nav-btn-a').removeClass('d-none')
        $('#nav-btn-b').addClass('d-none')
        $('#nav-btn-c').addClass('d-none')
        $('#nav-btn').addClass('d-none')
    }

    //<-- -----------------------------------------แสดงตารางหนังสือคำสั่ง -->
    function showTableDataCommand() {
        event.preventDefault();
        toggleTable('#table4')
        $('#nav-btn-b').removeClass('d-none')
        $('#nav-btn-a').addClass('d-none')
        $('#nav-btn-c').addClass('d-none')
        $('#nav-btn').addClass('d-none')
    }

    //<-- -----------------------------------------แสดงตารางหนังสือประกาศ -->
    function showTableAnnouce() {
        event.preventDefault();
        toggleTable('#table5')
        $('#nav-btn-c').removeClass('d-none')
        $('#nav-btn-a').addClass('d-none')
        $('#nav-btn-b').addClass('d-none')
        $('#nav-btn').addClass('d-none')
    }

    //<-- -----------------------------------------แสดงตารางหนังสือบันทึกข้อความ/แทงหนังสือภายใน -->
    function showTableRecord() {
        event.preventDefault();
        toggleTable('#table6')
    }


    function showTableDataSend() {
        event.preventDefault();
        toggleTable('#table2')
    }

    //<-- --------------------------------------------------แสดงหน้าหลัก -->
    function home() {
        console.log(adminLogin)
        event.preventDefault();
        toggleTable('#table1')
        $('#nav-btn-c').addClass('d-none')
        $('#nav-btn-a').addClass('d-none')
        $('#nav-btn-b').addClass('d-none')
        if (adminLogin == 'admin') {

            $('#nav-btn').removeClass('d-none')
        } else {
            $('#nav-btn').addClass('d-none')
        }


    }

    //<-- ---------------------------------------------ทำแถบสีเมนูที่คลิกเลือก -->
    $('.sidebar-nav').on('click', 'li', function () {
        $('.sidebar-nav li.active').removeClass('active');
        $(this).addClass('active');
    });

    $('.modal')
        .on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset').find('textarea').val('')
        })
        .on('shown.bs.modal', function () {
            $(this).find('form').find('.form-control, .form-select').first().focus()
        })


    $('#nav-btn-a').on('click', function () {
        addform2()
    })
    $('#nav-btn-b').on('click', function () {
        addform3()
    })
    $('#nav-btn-c').on('click', function () {
        addform4()
    })
    //<-- ------------------------------------บันทึกลงชีต หนังสือรับ(จากภายนอก) -->
    const saveForm = (obj) => {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        // $('#token').val(token)
        if (user != "") {
            Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
            Swal.showLoading();
            google.script.run.withSuccessHandler(function (outputx) {
                console.log('ok' + outputx)
                updateTable('#datatable', outputx)
            }).saveData(obj)
        } else {
            Swal.fire('กรุณาเข้าระบบ')
        }
    }

    //<-- ------------------------------------บันทึกลงชีต หนังสือส่ง -->
    const saveFormPost = (obj) => {
        event.preventDefault()

        // let user = $('#nameAdmin').text()
        // if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
        google.script.run.withSuccessHandler(function (outputx) {
            updateTable('#datatablepost', outputx)
            // loadBookIn()
        }).saveDataPost(obj)
    }

    //<-- ------------------------------------บันทึกลงชีต หนังสือคำสั่ง -->
    const saveFormCommand = (obj) => {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        // $('#token').val(token)
        // if(user!=""){
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
        google.script.run.withSuccessHandler(function (outputx) {
            updateTable('#datatablecommand', outputx)
            console.log((outputx))
        }).saveDataCommand(obj)
    }

    //<-- ------------------------------------บันทึกลงชีต หนังสือประกาศ -->
    const saveFormAnnounce = (obj) => {
        event.preventDefault()
        // let user = $('#nameAdmin').text()
        // if(user!=""){
        // $('#token').val(token)
        Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
        Swal.showLoading();
        google.script.run.withSuccessHandler(function (outputx) {
            console.log(outputx)
            updateTable('#datatableannounce', outputx)
        }).saveDataAnnouce(obj)
    }

    //<-- ------------------------------------บันทึกลงชีต หนังสือบันทึกข้อความ(หนังสือภายใน) -->
    const saveFormRecord = (obj) => {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        if (user != "") {
            Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
            Swal.showLoading();
            $('#user_save').val(user)
            // $('#token').val(token)
            //obj.user = user // ส่งตัวแปร user ไปกับ hidden input เพื่อไปบันทึกลงในคอลัมน์
            google.script.run.withSuccessHandler((outputx) => {
                updateTable('#datatablerecord', outputx)

            }).saveBookRecord(obj)
        } else {
            Swal.fire('กรุณาเข้าระบบ')
        }
    }

    //<-- --------------------------------------- สวิตช์ฟอร์มเมื่อกดปุ่ม submit -->
    function processForm(data) {
        let targetFunc = $('#targetFunc').val()
        console.log(targetFunc)
        switch (targetFunc) {
            case 'add': saveForm(data); break;
            case 'send': saveFormPost(data); break;
            case 'command': saveFormCommand(data); break;
            case 'announce': saveFormAnnounce(data); break;
            case 'record': saveFormRecord(data); break;
            default: break;
        }
    }

    function updateTable(table, data) {
        console.log(JSON.parse(data))
        $(table).DataTable().rows.add(JSON.parse(data)).draw(false)
        $('.modal').modal('hide')
        Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
            showConfirmButton: false,
            timer: 1500
        })
    }
