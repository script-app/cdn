      let foldertoken
    window.addEventListener("load", function () {
      
      google.script.run.withSuccessHandler(x =>{
         foldertoken = x
         console.log('xxxxxx   '+  JSON.stringify(foldertoken))
      }).getFolderAndToken()
        if (!sessionStorage.getItem("splash")) {
            waiting()
            setTimeout(() => {
                Swal.close();
                $('#Login').modal('show');
                // welcome()
            }, 3000)
            sessionStorage.setItem("splash", "true");
        }
     });

    window.addEventListener("load", function () {
        if (!sessionStorage.getItem("log")) {
            waiting()
            setTimeout(() => {
                Swal.close();
                // $('#Login').modal('show');
                 $('#wrapper').hide()
                 $('#login-page').show();
                // welcome()
            }, 3000)
        }else{
           $('#wrapper').show()
           $('#login-page').hide();
        }
     });

    waiting()
    function waiting() {
       Swal.fire({
          title: "กำลังโหลดข้อมูล...",
              text: "รอสักครู่",
              iconHtml: '<img src="https://icons8.com/preloaders/dist/media/hero-preloaders.svg" width="260px" style="border:0">',
            customClass: {
              icon: 'no-border'
            }
           });
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
        console.log('สถานะผู้ใช้งานคือ ' + status) //------------------เช็คจุดที่ 1
        // notification(name)
        if (status === null) {
            //           Swal.fire({ title: 'กำลังโหลดข้อมูล..' });
            // Swal.showLoading();
            // setTimeout(() => {
            //     Swal.close();
            //      welcome()
            // }, 3000)

            //$('#nav-btn3').addClass('d-none')
            google.script.run.withSuccessHandler(searchData).searchData('data')
        } else if (status == "admin") {
            //waiting()
            adminLogin = status
            showUserTable({ name: false, admin: true })
            $('#logoutbtn').show()
            $('#loginbtn').hide()
            $('#nameAdmin').text(name)
            $('#showname').show()
            $('#sendbtn').show()
            $('#commandbtn').show()
            $('#announcebtn').show()
            $('#homebtn').addClass('active');
            // <-- ------------------------------ปุ่มเรียกฟอร์ม -->
            $('#nav-btn').removeClass('d-none')
            $('#nav-btn2').addClass('d-none')
            $('#nav-btn3').addClass('d-none')
            console.log('ผู้เข้าระบบชื่อว่า ' + name)
        } else {
            //waiting()
            $('#nav-btn').addClass('d-none')
            $('#nav-btn2').addClass('d-none')
            $('#nav-btn3').addClass('d-none')
            //showUserTable({ name: false, admin: true }) // ตารางหนังสือรับกลาง
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
                $('#keepdocbtn').show() //ปุ่มเมนูบันทึกข้อความ
                $('#homebtn').hide()
                $('#websitebtn').hide()
                console.log('ผู้เข้าระบบ ชื่อ ' + name)

            }).searchDataSend(name)

        }
    })

    //<-- ------------------------------------ฟอร์ม Logout -->
    function logout() {
        event.preventDefault()
        Swal.fire({
            position: 'top',
            title: 'คุณต้องการออกจากระบบ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
             buttonsStyling: false,
            confirmButtonText: 'ออกจากระบบ',
            customClass: {
                confirmButton: 'swal-button-ok',
                cancelButton: 'swal-button-cancle'
              },

        }).then((result) => {

            if (result.isConfirmed) {
                reLoad()
                Swal.fire({ 
                  title: 'กำลังออกจากระบบ..' ,text:'รอสักครู่'});
                Swal.showLoading();

                sessionStorage.removeItem("Status");
                sessionStorage.removeItem("Name");
                sessionStorage.removeItem("Datauser");
            }
        })
    }

    //<-- ------------------------------------ฟอร์ม Login -->
    function loginform() {
        event.preventDefault()
        Swal.fire({
            title: 'ลงชื่อเข้าใช้งาน',
            html: `<input type="text" id="user" class="swal2-input" placeholder="ชื่่อผู้ใช้"><input type="password" id="pass" class="swal2-input" placeholder="รหัสผ่าน">`,
            showCancelButton: true,
            buttonsStyling: false,
            // confirmButtonColor: '#0D6EFD',
            // cancelButtonColor: '#FE703D',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'เข้าสู่ระบบ',
              customClass: {
                confirmButton: 'swal-button-ok',
                cancelButton: 'swal-button-cancle'
              },

            imageWidth: 50,
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
                        $('#keepdocbtn').show() //ปุ่มเมนูเก็บเอกสาร
                        $('#loginbtn').hide()
                        $('#homebtn').addClass('active');
                        
                        $('#setup').show()
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
                        //$('#nav-btn3').removeClass('d-none')

                        if (rowindex[0][6] == 'admin') {

                            //<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น Admin -->

                            $('#nav-btn').removeClass('d-none')
                            $('#nav-btn2').addClass('d-none')
                            $('#nav-btn3').addClass('d-none')
                            $('#nav-btn-c').addClass('d-none')
                            $('#nav-btn-a').addClass('d-none')

                            Swal.fire({ title: 'กำลังเข้าสู่ระบบ admin' });
                            Swal.showLoading();
                            setTimeout(() => {
                                Swal.close();
                            }, 2000)
                            //    $('#nav-btn').text('เพิ่มข้อมูล').attr('data-form', 'formAdd').removeClass('d-none')
                            showUserTable({ name: rowindex[0][1], admin: true })
                            // console.log('data ' + rowindex[0][1])
                        } else {
                            
                            //<-- -----------------------------กรณีที่ลงชื่อเข้าใช้เป็น User -->

                            $('#sendbtn,#commandbtn,#announcebtn,#setup').hide()
                            $('#nav-btn').addClass('d-none')
                            $('#nav-btn2').addClass('d-none')
                            $('#nav-btn3').addClass('d-none')
                            $('#nav-btn-c').addClass('d-none')
                            Swal.fire({ title: 'กำลังเข้าสู่ระบบ user' });
                            Swal.showLoading();
                            setTimeout(() => {
                                Swal.close();
                            }, 2000)

                            google.script.run.withSuccessHandler((result) => {
                                console.log('นี่คือ' + result)
                                dataSend = result
                                showUserTable({ name: rowindex[0][1], admin: false })
                                console.log('data ' + rowindex[0][1])
                            }).searchDataSend(rowindex[0][1])
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
var rowdataRecord
    function showUserTable({ name, admin }) {
        if (admin) {
            $('#table1').show() //แสดงตารางหนังสือรับ
            $('#table2').hide()
            $('#table3').hide()
            $('#table4').hide()
            $('#table5').hide()
            $('#table6').hide()
            $('#table7').hide()
            $('#recordbtn').hide()
            $('#keepdocbtn').hide() //ปุ่มจัดเก็บเอกสาร
            $('#home-btn').addClass('active');

            $('#h-btn').hide()
            $('#setup').show()
            $('#websitebtn').hide()
            google.script.run.withSuccessHandler(searchData).searchData('data')
            return

        } else {
            if (!dataSend || !dataRecord || !dataKeepFile) {
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
            $('#home-btn').hide() // -----------------------ซ่อนปุ่ม home ถ้า user login เข้ามา
            $('#setup').hide()
            $('#bookinbtn').show() // ------------------ แสดงปุ่มหนังสือภายใน ------>
            $('#bookinbtn').addClass('active');
            $('#h-btn').hide()
            $('#homebtn').hide()
            $('#websitebtn').hide()

            let rowdata = dataSend.filter(r => r[14] == name) //ค้นหาข้อมูลตามชื่อที่แทงหนังสือในชีต send คอลัมน์ที่ 14
                searchDataS(rowdata) //เรียกฟังก์ชั่นไปค้นหาข้อมูลเพื่อแสดงตาราง tableSend ของแต่ละกอง ที่ login เข้ามา

            rowdataRecord = dataRecord.filter(r => r[15] == name) //ค้นหาข้อมูลตามชื่อผู้บันทึกในชีต บันทึก คอลัมน์ที่ 15
                searchDataRecord(rowdataRecord)

             let rowdataKeepFile = dataKeepFile.filter(r => r[12] == name) //ค้นหาข้อมูลตามชื่อผู้ปฏิบัติในชีต ตู้เก็บเอกสาร คอลัมน์ที่ 12
                searchDataKeepFile(rowdataKeepFile)

            showUserTable
            sessionStorage.setItem("Datauser", rowdata);
            //console.log(rowdata)
            $('#addbtn').hide()
            $('#sendbtn').hide()
            $('#commandbtn').hide()
            $('#announcebtn').hide()
            $('#table6').hide()
            $('#table7').hide()
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

    //<-- ------------------------------------ปุ่ม -->

    $('#nav-btn').on('click', function () { addform1() }) //หนังสือรับ

    $('#nav-btn-a').on('click', function () { addform2() }) //หนังสือส่ง

    $('#nav-btn-b').on('click', function () { addform3() }) //หนังสือส่งคำสั่ง

    $('#nav-btn-c').on('click', function () { addform4() }) //หนังสือประกาศ

    $('#nav-btn2').on('click', function () { addform5() }) //หนังสือบันทึกข้อความ

     $('#nav-btn3').on('click', function () { addform6() }) //เก็บเอกสารเข้าตู้เก็บ

    //<-- --------------------------------------แสดงฟอร์ม Modal หนังสือรับ -->
    function addform1() {
        event.preventDefault();
        setForm('add', 'ฟอร์มหนังสือรับ')
        toggleFormInput(false)
        $('#modal_form1').modal('show')

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
        $('#closeModal1').click()
        toggleFormInput(false)
        $('#modal_form1').modal('show')
    }

    //<-- ------------------------------แสดงฟอร์ม Modal เก็บเอกสารเข้าตู้เก็บ -->
    function addform6() {
       event.preventDefault();
       $('#closeModalKeep').click()
       $('#modal_form_keep').modal('show')
    }

    //<-- ------------------------------ฟังก์ชั่น แสดงชื่อฟอร์ม -->
    function setForm(target, title) {
        $('#targetFunc').val(target)
        $('.form-title').text(title)
        console.log('ชื่อฟอร์มคือ' + title)
    }

    //<-- ------------------------------แสดงตาราง -->
    function toggleTable(table) {
        $('#table1,#table2,#table3,#table4,#table5,#table6,#table7,#formSetup').hide()
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

    //<-- -----------------------------------------แสดงตารางหนังสือรับภายในของแต่ละกอง -->
    function showTableDataSend() {
        event.preventDefault();
        toggleTable('#table2')
        $('#nav-btn2').addClass('d-none')
        $('#nav-btn3').addClass('d-none')

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
        $('#nav-btn2').removeClass('d-none')
        $('#nav-btn3').addClass('d-none')
    }

    //<-- -----------------------------------------แสดงตารางตู้เก็บเอกสาร -->
    function showTableKeepDocs() {
        event.preventDefault()
        toggleTable('#table7')
        $('#nav-btn2').addClass('d-none')
        $('#nav-btn3').removeClass('d-none')


    }

    //<-- --------------------------------------------------แสดงหน้าหลัก -->
    function home() {
        // console.log('user ขณะนี้คือ ' + adminLogin)
        event.preventDefault();
        toggleTable('#table1')
        $('#nav-btn-c').addClass('d-none')
        $('#nav-btn-a').addClass('d-none')
        $('#nav-btn-b').addClass('d-none')
        $('#nav-btn2').addClass('d-none')
        $('#nav-btn3').addClass('d-none')
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



    //<-- ------------------------------------บันทึกลงชีต หนังสือรับ(จากภายนอก) -->
    const saveForm = (obj) => {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        // $('#token').val(token)
        if (user != "") {
            Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
            Swal.showLoading();
            google.script.run.withSuccessHandler(function (outputx) {
                console.log('ok ส่งค่ามาจาก gs แล้ว' + outputx)
                // updateTable('#datatable', outputx)
            createPdf(outputx)
            }).saveData(obj)
            //ไปทำเพิ่มตราประทับที่ไฟล์ stampBook
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
    function saveFormRecord(obj){
        event.preventDefault()
        let user = $('#nameAdmin').text()
          $('#user_save').val(user)
            Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
            Swal.showLoading();
            obj.user = user // ส่งตัวแปร user ไปกับ hidden input เพื่อไปบันทึกลงในคอลัมน์
            google.script.run.withSuccessHandler((outputx) => {
                updateTable('#datatablerecord', outputx)

            }).saveBookRecord(obj)

    }

    //<-- ---------------------------------------สวิตช์ฟอร์มเมื่อกดปุ่ม submit จาก addForm-->
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

//<-- ---------------------------------------ตั้งค่าระบบ-->
    function setUpSystem(obj) {
        event.preventDefault()
        let user = $('#nameAdmin').text()
        if (user != "") {
            Swal.fire({ title: 'รอสักครู่..กำลังติดตั้งระบบ' });
            Swal.showLoading();
            $('#user_save').val(user)
            google.script.run.withSuccessHandler(() => {
                $('.modal').modal('hide')
                Swal.fire({
                    icon: 'success',
                    title: 'ติดตั้งระบบเรียบร้อยแล้ว',
                    showConfirmButton: false,
                    timer: 1500
                })
                reLoad()
            }).saveSetting(obj)
        } else {
            Swal.fire('กรุณาเข้าระบบ')
        }
    }

//<-- ---------------------------------------อัปเดตตาราง-->
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

//<-- ---------------------------------------บันทึกระบบ-->
    //เรียก modal ฟอร์ม  สำหรับติดตั้งค่าระบบ
    function setup() {
        event.preventDefault()
        Swal.fire({ title: 'กำลังโหลดข้อมูลการตั้งค่าระบบ' });
        Swal.showLoading();
        google.script.run.withSuccessHandler(loadSetup).loadSetting()
        toggleTable('#formSetup')
        $('#modalSetup').modal('show')

        $('#nav-btn-c').addClass('d-none')
        $('#nav-btn-a').addClass('d-none')
        $('#nav-btn-b').addClass('d-none')
        $('#nav-btn').addClass('d-none')

    }
    //นำค่าที่ได้ใส่ลงในฟอร์ม
    function loadSetup(output) {
        Swal.close();
        document.getElementsByName("box1")[0].value = output[0]
        document.getElementsByName("box2")[0].value = output[1]
        document.getElementsByName("box3")[0].value = output[2]
        document.getElementsByName("box4")[0].value = output[3]
        document.getElementsByName("box5")[0].value = output[4]
        document.getElementsByName("box6")[0].value = output[5]
        document.getElementsByName("box7")[0].value = output[6]
        document.getElementsByName("box8")[0].value = output[7]
        document.getElementsByName("box9")[0].value = output[8]
        document.getElementsByName("box10")[0].value = output[9]
        document.getElementsByName("box11")[0].value = output[10]
        document.getElementsByName("box12")[0].value = output[11]
        document.getElementsByName("box13")[0].value = output[12]
    }

//<-- ---------------------------------------จัดการตู้เก็บเอกสาร-->
window.onload = ()=>{
   google.script.run.withSuccessHandler(dropDownList).getDropDown()
}
function dropDownList(obj){
console.log(obj)
let colA = document.getElementById('colA')
let colB = document.getElementById('colB')
let colC = document.getElementById('colC')
let colD = document.getElementById('colD')
colB.disabled = true
colC.disabled = true
colD.disabled = true
for(let a in obj){
   colA.options[colA.options.length] = new Option(a,a)
}
sortSelect(colA)
colA.onchange = function(){
  colB.disabled = false
  colB.length = 1
  colC.length = 1
  colD.length = 1
  for(let b in obj[this.value]){
 colB.options[colB.options.length] = new Option(b,b)
  }
  resetDropdown([colB,colC,colD])
  
}
sortSelect(colB)
colB.onchange = function(){
  colC.disabled = false
  colC.length = 1
  colD.length = 1
  for(let c in obj[colA.value][this.value]){
 colC.options[colC.options.length] = new Option(c,c)
  }
  resetDropdown([colC,colD])
}
sortSelect(colC)
colC.onchange = function(){
  colD.disabled = false
  colD.length = 1
  let d = obj[colA.value][colB.value][this.value]
  for(let i = 0; i < d.length; i++){
 colD.options[colD.options.length] = new Option(d[i],d[i])
  }
  resetDropdown([colD])
}

}

function resetDropdown(elements){
  elements.forEach(element =>{
    element.options[0].selected = true
  })
}

//<-- ---------------------------------------บันทึกข้อมูลลงตู้เก็บเอกสาร-->
  function saveKeepForm(obj){
    let user = $('#nameAdmin').text()
    $('#user_group').val(user)
    event.preventDefault()
    Swal.fire({ title: 'รอสักครู่..กำลังบันทึกข้อมูล' });
    Swal.showLoading();
     google.script.run.withSuccessHandler((outputx)=>{
      //document.getElementById('myformkeep').reset()
      updateTable('#datatablekeepDocs', outputx)
    }).saveFileDocs(obj)

  }

//<-- --------------------------------------- เรียงรายการตามลำดับใน DropDown
function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
 var a = tmpAry.shift()
    tmpAry.sort();
    console.log(tmpAry)
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    tmpAry.unshift(a)
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return ;
}
