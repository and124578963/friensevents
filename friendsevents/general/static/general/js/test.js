;function select_way(){
    let way = document.getElementById('way');
    let losses = document.getElementById('losses');
    losses.value = way.value;
};

function get_file(){
    let input = document.getElementById('file');
    var file =  input.files[0];
    console.log(file);
    handleFile(file);
};

const handleFile = file => {
    if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        let div_input = document.getElementById('div_input');
        div_input.remove();
        let div_general = document.getElementById('general');
        div_general.style = 'display: block'
        var json = new ExcelToJSON();
        json.parseExcel(file);
    }
    else{
        let warning = document.getElementById('warning_file');
        warning.innerHTML = 'Загрузите Excel файл по шаблону!';
        warning.style = "font-size:8pt; color:red";
        return;
    }
};

var ExcelToJSON = function() {

  this.parseExcel = function(file) {
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });

      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        if (sheetName=='Системы'){
        insert_name_systems(json_object);}
        if (sheetName=='Инфорация об лкм'){
        parse_lkm(json_object);}
        if (sheetName=='Растворители'){
        parse_solvent(json_object);}
      })

    };

    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};

function insert_name_systems(json_object){
    var systems = JSON.parse(json_object);
    globalThis.systems = systems
    let input = document.getElementById('name');
    for (let row of systems){
        input.options[input.options.length] = new Option(row['Название системы'], input.options.length);
    };
};

function parse_solvent(json_object){
    var solvents = JSON.parse(json_object);
    globalThis.solvents = solvents
    let input = document.getElementById('solvent');

};

function parse_lkm(json_object){
    var lkms_list = JSON.parse(json_object);
    globalThis.lkms_list = lkms_list
    console.log(lkms_list);
    for (let row of lkms_list){
        console.log(row['Название покрытия']);
    };
};

function insert_name_solvent(Obj){
        for (let row of globalThis.solvents){
            Obj.options[Obj.options.length] = new Option(row['Название растворителя'], Obj.options.length);
        };
}

function insert_colour(Obj, choiced_lkm){
        for (lkm of globalThis.lkms_list){
            if(lkm['Название покрытия']==choiced_lkm){
                var obj_lkm = lkm;

                break;
            }
        }
        var list_keys = Object.keys(obj_lkm);
        var list_colour = []

        for(keys in list_keys){

               if(list_keys[keys] !='Название покрытия'&&list_keys[keys] !='Расход для 100 мкм кг/м2'&&list_keys[keys] !='Фасовка'){
               list_colour.push(list_keys[keys]);
               };
        };

        for (let row of list_colour){
            Obj.options[Obj.options.length] = new Option(row, Obj.options.length);
        };
}

function view_lkm_of_system(){
       var div_lkms_Obj = document.getElementById('lkms');

       while (div_lkms_Obj.firstChild) {
             div_lkms_Obj.removeChild(div_lkms_Obj.firstChild);
              };

       let input = document.getElementById('name');
       let selected_system = globalThis.systems[input.value];
       let film1 = selected_system['Слой 1'];
       let film2 = selected_system['Слой 2'];
       let film3 = selected_system['Слой 3'];
       let film4 = selected_system['Слой 4'];
       let list_films = [film1, film2, film3, film4];
       globalThis.list_films = []
       for (i in list_films){
           if(list_films[i] != undefined){
               globalThis.list_films.push(list_films[i])
               let row = document.createElement('tr');
               let label = document.createElement('td');
               label.innerHTML = list_films[i];

               let colour_td = document.createElement('td');
               let colour_select = document.createElement('select');
               colour_select.id = 'color' + i
               insert_colour(colour_select, list_films[i]);
               colour_td.append(colour_select);

               let solvent_td = document.createElement('td');
               let solvent_select = document.createElement('select');
               solvent_select.id = 'name_solvent' + i
               insert_name_solvent(solvent_select);
               solvent_td.append(solvent_select);

               let solvent_amount_td = document.createElement('td');
               let solvent_amount = document.createElement('input');
               solvent_amount.id = 'amount_solvent' + i
               solvent_amount_td.append(solvent_amount, '  %');

               row.append(label,colour_td, solvent_td,solvent_amount_td);
               div_lkms_Obj.append(row);}
       };
}

function main(){

    var losses = document.getElementById('losses');
    losses = losses.value;
    var area = document.getElementById('area');
    area = area.value;
    var system_index = document.getElementById('name');
    system_index = system_index.value;
    var system = globalThis.systems[system_index];

    var result_name = []
    var result_mass_teor = []
    var result_mass_losses = []
    var result_cost = []
    var result_volume = []
    var result_color = []
    var result_teor_rashod = []
    var result_pract_rashod = []
    var list_thickness = []

    var solvents_name = []
    var solvents_mass_teor = []
    var solvents_mass_losses = []
    var solvents_cost = []
    var solvents_volume = []
    var solvents_layer = []

//Получение информации по всем лкп
    for (i=1; i<=globalThis.list_films.length; i++){
        let thickness = system[`Толщина ${i}`];
        list_thickness.push(thickness);

        for (lkm of globalThis.lkms_list){
            if(lkm['Название покрытия']==globalThis.list_films[i-1]){
                var obj_lkm = lkm;
                break;
            }
        }
        let consumption_on100 = obj_lkm['Расход для 100 мкм кг/м2'];
        let consumption = (thickness/100) * consumption_on100;
        result_teor_rashod.push(consumption);
        let consumption_with_losses = consumption / ((100-losses)/100);
        result_pract_rashod.push(consumption_with_losses);
        let teor_mass = consumption * area;
        let mass_with_losses = teor_mass / ((100-losses)/100);
        let volume = obj_lkm['Фасовка'];

        let color_text = document.getElementById(`color${i-1}`);
        color_text = color_text.options[color_text.selectedIndex].text
        result_color.push(color_text)
        let cost = obj_lkm[color_text]

        result_name.push(globalThis.list_films[i-1]);
        result_mass_teor.push(teor_mass);
        result_mass_losses.push(mass_with_losses);
        result_volume.push(volume);
        result_cost.push(cost);


//Получение информации по растворителям
        let solvent_index = document.getElementById(`name_solvent${i-1}`);
        solvent_index = solvent_index.value

        let Obj_solvent = globalThis.solvents[solvent_index];
        let solvent_percent = document.getElementById(`amount_solvent${i-1}`);
        solvent_percent = solvent_percent.value
        if(solvent_percent>0){

            let s_cost = Obj_solvent['Цена за кг'];
            let s_volume = Obj_solvent['Фасовка кг'];

            let s_teor_mass = teor_mass * (solvent_percent/100);
            let s_mass_with_losses = mass_with_losses * (solvent_percent/100);

            solvents_mass_teor.push(s_teor_mass);
            solvents_mass_losses.push(s_mass_with_losses);
            solvents_name.push(Obj_solvent['Название растворителя']);
            solvents_cost.push(s_cost);
            solvents_volume.push(s_volume);
            solvents_layer.push(i);
        };


    }



//Преобразования масс под массу фасовки для таблицы 2
    var converted_mass_lkm_2 = []
    for(i in result_mass_losses){
        if(result_mass_losses[i]%result_volume[i] != 0){
        let mass = Math.ceil(result_mass_losses[i]/result_volume[i])*result_volume[i];
        converted_mass_lkm_2.push(mass);
        }
    }

    var cost_lkm_to_table2 = [];
    for(i in result_cost){
        let cost_cost = result_cost[i] * converted_mass_lkm_2[i];
        cost_lkm_to_table2.push(cost_cost);
    };



//вставка лкп в таблицу 2
    var table2 = document.getElementById('result_table_2');
    while (table2.childNodes.length != 1) {
                 table2.removeChild(table2.lastChild);
                  };

    for(i in result_name){
        let row = document.createElement('tr');
        let layer = document.createElement('td');
        layer.innerHTML =  Number(i)+1;
        let name = document.createElement('td');
        name.innerHTML =  `${result_name[i]} (${result_color[i]})`;
        let thickness_td = document.createElement('td');
        thickness_td.innerHTML = list_thickness[i];
        let cost_per_one = document.createElement('td');
        cost_per_one.innerHTML = String(result_cost[i]).replace('.',',');
        let teor_rash = document.createElement('td');
        teor_rash.innerHTML = String(result_teor_rashod[i].toFixed(3)).replace('.',',');
        let pract_rash = document.createElement('td');
        pract_rash.innerHTML = String(result_pract_rashod[i].toFixed(3)).replace('.',',');
        let mass = document.createElement('td');
        mass.innerHTML =  String(converted_mass_lkm_2[i]).replace('.',',');
        let cost = document.createElement('td');
        cost.innerHTML =  String(cost_lkm_to_table2[i].toFixed(2)).replace('.',',');
        row.append(name, layer, thickness_td, cost_per_one,teor_rash, pract_rash, mass, cost);
        table2.append(row);}


//пересчет массы и цены для таблицы 2
 var s_converted_mass_table2 = []
    for(i in solvents_mass_losses){
        if(solvents_mass_losses[i]%solvents_volume[i] != 0){
        let mass = Math.ceil(solvents_mass_losses[i]/solvents_volume[i])*solvents_volume[i];
        s_converted_mass_table2.push(mass);
        }
    }

    var s_cost_table2 = [];
    for(i in solvents_cost){
        let cost_cost = solvents_cost[i] * s_converted_mass_table2[i];
        s_cost_table2.push(cost_cost);
    };
//вставка растворителья в таблицу 2
    for(i in solvents_name){
        let row = document.createElement('tr');
        let layer = document.createElement('td');
        layer.innerHTML =  solvents_layer[i];
        let name = document.createElement('td');
        name.innerHTML =  solvents_name[i];
        let cost_per_one = document.createElement('td');
        cost_per_one.innerHTML = String(solvents_cost[i]).replace('.',',');
        let empty1 = document.createElement('td');
        let empty2 = document.createElement('td');
        let empty3 = document.createElement('td');
        let mass = document.createElement('td');
        mass.innerHTML =  String(s_converted_mass_table2[i]).replace('.',',');
        let cost = document.createElement('td');
        cost.innerHTML =  String(s_cost_table2[i].toFixed(2)).replace('.',',');
        row.append(name,layer,empty3, cost_per_one, empty1, empty2, mass, cost);
        table2.append(row);}




//Объединение повторяющихся элементов лкм
    var new_result_name = [];
    var new_result_mass_teor = [];
    var new_result_mass_losses = [];
    var new_result_volume = [];
    var new_result_color = []
    var new_result_teor_rashod = []
    var new_result_pract_rashod = []

    for (i in result_name){
        if (!new_result_name.includes(`${result_name[i]}**${result_cost[i]}`)){
           new_result_name.push(`${result_name[i]}**${result_cost[i]}`);
           new_result_volume.push(result_volume[i]);
           new_result_color.push(result_color[i]);
           new_result_teor_rashod.push(result_teor_rashod[i]);
           new_result_pract_rashod.push(result_pract_rashod[i]);

           var mass_teor = 0;
           var mass_losses = 0;
           for(ii in result_name){
                if(`${result_name[i]}**${result_cost[i]}` == `${result_name[ii]}**${result_cost[ii]}`){
                mass_teor += result_mass_teor[ii];
                mass_losses += result_mass_losses[ii];
                };
           };
           new_result_mass_teor.push(mass_teor);
           new_result_mass_losses.push(mass_losses);

        };
    };
//Объединение повторяющихся элементов растворители
    var new_solvents_name = [];
    var new_solvents_mass_teor = [];
    var new_solvents_mass_losses = [];
    var new_solvents_volume = [];

    for (i in solvents_name){
        if (!new_solvents_name.includes(`${solvents_name[i]}**${solvents_cost[i]}`)){
           new_solvents_name.push(`${solvents_name[i]}**${solvents_cost[i]}`);
           new_solvents_volume.push(solvents_volume[i]);
           var s_mass_teor = 0;
           var s_mass_losses = 0;
           for(ii in solvents_name){
                if(`${solvents_name[i]}**${solvents_cost[i]}` == `${solvents_name[ii]}**${solvents_cost[ii]}`){
                s_mass_teor += solvents_mass_teor[ii];
                s_mass_losses += solvents_mass_losses[ii];
                };
           };
           new_solvents_mass_teor.push(s_mass_teor);
           new_solvents_mass_losses.push(s_mass_losses);

        };
    };
//Разделение имен и цен лкм и растворителей
    var sep_name_lkm = [];
    var sep_cost_lkm = [];
    for(i in new_result_name){
        var name_cost = new_result_name[i].split('**');
        sep_name_lkm.push(name_cost[0]);
        sep_cost_lkm.push(name_cost[1]);
    }

    var sep_name_solv = [];
    var sep_cost_solv = [];
    for(i in new_solvents_name){
        var s_name_cost = new_solvents_name[i].split('**');
        sep_name_solv.push(s_name_cost[0]);
        sep_cost_solv.push(s_name_cost[1]);
        }



//Преобразования масс под массу фасовки
    var converted_mass = []
    for(i in new_result_mass_losses){
        if(new_result_mass_losses[i]%new_result_volume[i] != 0){
        let mass = Math.ceil(new_result_mass_losses[i]/new_result_volume[i])*new_result_volume[i];
        converted_mass.push(mass);
        }
    }

    var cost_2 = [];
    for(i in sep_cost_lkm){
        let cost_cost = sep_cost_lkm[i] * converted_mass[i];
        cost_2.push(cost_cost);
    };

//Рисование лкм в таблице 1
    var table = document.getElementById('result_table');
    while (table.childNodes.length != 1) {
                 table.removeChild(table.lastChild);
                  };

    for(i in sep_name_lkm){
        let row = document.createElement('tr');
        let number = document.createElement('td');
        number.innerHTML =  Number(i)+1;
        let name = document.createElement('td');
        name.innerHTML =  `${sep_name_lkm[i]} (${new_result_color[i]})`;
        let cost_per_one = document.createElement('td');
        cost_per_one.innerHTML = String(sep_cost_lkm[i]).replace('.',',');
        let teor_rash = document.createElement('td');
        teor_rash.innerHTML = String(new_result_teor_rashod[i].toFixed(3)).replace('.',',');
        let pract_rash = document.createElement('td');
        pract_rash.innerHTML = String(new_result_pract_rashod[i].toFixed(3)).replace('.',',');
        let mass = document.createElement('td');
        mass.innerHTML =  String(converted_mass[i]).replace('.',',');
        let cost = document.createElement('td');
        cost.innerHTML =  String(cost_2[i].toFixed(2)).replace('.',',');
        row.append(number,name, cost_per_one,teor_rash, pract_rash, mass, cost);
        table.append(row);}



//Преобразования масс под массу фасовки

    var s_converted_mass = []
    for(i in new_solvents_mass_losses){
        if(new_solvents_mass_losses[i]%new_solvents_volume[i] != 0){
        let mass = Math.ceil(new_solvents_mass_losses[i]/new_solvents_volume[i])*new_solvents_volume[i];
        s_converted_mass.push(mass);
        }
    }

    var s_cost_2 = [];
    for(i in sep_cost_solv){
        let cost_cost = sep_cost_solv[i] * s_converted_mass[i];
        s_cost_2.push(cost_cost);
    };
//Рисование растворителей в таблице 1
    for(i in sep_name_solv){
        let row = document.createElement('tr');
        let number = document.createElement('td');
        number.innerHTML =  Number(i) + 1 + sep_name_solv.length;
        let name = document.createElement('td');
        name.innerHTML =  sep_name_solv[i];
        let cost_per_one = document.createElement('td');
        cost_per_one.innerHTML = String(sep_cost_solv[i]).replace('.',',');
        let empty1 = document.createElement('td');
        let empty2 = document.createElement('td');
        let mass = document.createElement('td');
        mass.innerHTML =  String(s_converted_mass[i]).replace('.',',');
        let cost = document.createElement('td');
        cost.innerHTML =  String(s_cost_2[i].toFixed(2)).replace('.',',');
        row.append(number,name, cost_per_one, empty1, empty2, mass, cost);
        table.append(row);}

//Подсчет итоговой стоимости
    var final_cost = 0;
    for(i in s_cost_2){
       final_cost += s_cost_2[i];
    };
    for(i in cost_2){
       final_cost += cost_2[i];
    };

    var final_cost2 = 0;
    for(i in s_cost_table2){
       final_cost2 += s_cost_table2[i];
    };
    for(i in cost_lkm_to_table2){
       final_cost2 += cost_lkm_to_table2[i];
    };


    let final_row = document.createElement('tr');
    let empty1 = document.createElement('td');
    let empty2 = document.createElement('td');
    let empty3 = document.createElement('td');
    let empty4 = document.createElement('td');
    let empty5 = document.createElement('td');
    let empty6 = document.createElement('td');
    let label = document.createElement('td');
    label.innerHTML = "Итого";
    let final_cost_td = document.createElement('td');
    final_cost_td.innerHTML = String(final_cost.toFixed(2)).replace('.',',');
    final_row.append(empty1,empty2,empty3,empty4,empty5,label,final_cost_td );
    table.append(final_row);

    let empty12 = document.createElement('td');
    let empty22 = document.createElement('td');
    let empty32 = document.createElement('td');
    let empty42 = document.createElement('td');
    let empty52 = document.createElement('td');
    let empty62 = document.createElement('td');
    let label2 = document.createElement('td');
    label2.innerHTML = "Итого";
    let final_cost_td2 = document.createElement('td');
    final_cost_td2.innerHTML = String(final_cost2.toFixed(2)).replace('.',',');
    let final_row_table2 = document.createElement('tr');
    final_row_table2.append(empty12,empty22,empty32,empty42,empty52,empty62,label2,final_cost_td2 );
    table2.append(final_row_table2)


}
