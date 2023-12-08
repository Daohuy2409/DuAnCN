import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = 'https://wdohfulehighqhskimgp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2hmdWxlaGlnaHFoc2tpbWdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDY1MDg4MywiZXhwIjoyMDE2MjI2ODgzfQ.Nhv6XCrI4zobnFkN1yHX8bc_n1qXF5d2fZLpk9NSE2M';
const supabase = createClient(supabaseUrl, supabaseKey);
async function getClassList(username) {
    try {
        const {data: ID, err}= await supabase.from('teacher').select('ID').eq('UserName', username);
        if (err) throw err;
        const id = ID[0].ID
        const { data, error } = await supabase.from('class').select('ClassID').eq('TeacherID', id);
        if (error) throw error;
        let ClassList =[]
        data.forEach(item =>{
            ClassList.push(item.ClassID);
        })
        return ClassList;
    } catch (error) {
      console.error('Error querying Supabase:', error.message);
    }
}

async function checkAccount(username, password, user) {
    if (user =="teacher") {
        const {data, err} = await supabase.from('teacher').select('*').eq('UserName', username).eq('Password', password);
        if (err) throw err;
        if (data != null && data.length > 0) return 'teacher'
        else return 'No'
    } else {
        const {data, err} = await supabase.from('studentaccount').select('*').eq('UserName', username).eq('Password', password);
        if (err) throw err;
        if (data != null && data.length > 0) return 'student'
        else return 'No'
    }
}

async function DiemDanh(MMH, week, MSV) {
    try {
        const { data, error } = await supabase.from(MMH).select(week).eq('MSV', MSV);
        if (error) throw error;
        //check xem có học sinh này ko
        if (data[0][week] == 'NULL' && data.length > 0) {
            const currentDate = new Date();
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const now = new Intl.DateTimeFormat('vn-GB', options).format(currentDate);

            const { error: updateError } = await supabase
                .from(MMH)
                .update({ [week]: now })
                .eq('MSV', MSV);

            if (updateError) throw updateError;

            return "Điểm danh thành công!";
        } else if (data[0][week] != 'NULL'){
            return "Bạn đã điểm danh!";
        } else {
            return "Bạn không ở lớp này!";
        }
    } catch (error) {
        console.error('Error:', error.message);
        return "Có lỗi xảy ra!";
    }
}
async function createList(MMH) {
    try {
        var list = [[
            { v: "STT", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Mã SV", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Họ và tên", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Ngày sinh", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Tuần 1", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Tuần 2", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Tuần 3", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Tuần 4", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}},
            { v: "Tuần 5", t: "s", s: { alignment: {horizontal: "center"}, font: {name: "Arial", bold: true, sz: 10}}}
        ]]
        const { data, error } = await supabase.from(MMH).select(
            `STT, MSV,
            Student(FullName, birthday),
            Tuan_1, Tuan_2, Tuan_3, Tuan_4, Tuan_5`
        ).order('STT', { ascending: true })
        if (error) throw error;
        if (data) {
            data.forEach(row => {
                list.push([
                    row["STT"], row["MSV"], row.Student["FullName"], row.Student["birthday"],
                    row["Tuan_1"], row["Tuan_2"], row["Tuan_3"], row["Tuan_4"], row["Tuan_5"]
                ]);
            });
        }
        return list;
    } catch (err) {
        console.log(err);
    }
}

async function exportExcel(MMH) {
    try {
        const result = await createList(MMH);
        return result;
    } catch (err) {
        console.log(err);
    }
}
export { checkAccount, getClassList, DiemDanh, exportExcel};