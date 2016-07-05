'use strict';
const pathsFactory = require('./paths');

const $title = 'Placar da Mobilidade';
const $description = [
    'Ajude o Movimento Brasil Livre a pressionar os deputados para votarem a favor do projeto de lei',
    'que regulamenta os aplicativos de compartilhamento de veículos, tais como o Uber, BlaBlaCar e Cabify.',
    'Pela mobilidade urbana e pelo direito de escolha!'
].join(' ');

module.exports = ($datum) => {
    if (!$datum) $datum = {path: 'mobilidade'};

    let paths = pathsFactory($datum);
    let fromCity = $datum.city && `de ${$datum.city}` || '';

    if (!$datum.keywords || !~$datum.keywords.indexOf('mbl.org.br')) {
        $datum.keywords = [
            $datum.keywords,
            'mobilidade', 'urbana', 'uber', 'blablacar', 'cabify',
            'movimento', 'brasil', 'livre', 'mbl', 'mbl.org.br', 'mblivre'
        ].filter(k => !!k).join(',');
    }

    return (obj) => {
        let baseUrl = paths.url.city,
            _title = `${$title} ${fromCity}`;
        let tpl = obj || {};

        tpl.state = $datum.state;
        tpl.version = paths.pack.version;
        tpl.title = _title;
        tpl.baseUrl = baseUrl;
        tpl.url = baseUrl;
        tpl.desc = $datum.desc || $description;
        tpl.keywords = $datum.keywords;
        tpl.imageUrl = `/images/logo-fim-foro-${tpl.version}.jpg`;
        if (tpl.fullName) {
            let isMale = tpl.gender.trim() === 'M',
                vote = tpl.vote;
            tpl.art = isMale ? 'o' : 'a';
            tpl.pos = vote ? 'a favor' : vote === false ? 'contra' : isMale ? 'indeciso' : 'idencisa';
            let titlePos = `${vote === undefined ? 'está' : 'é'} ${tpl.pos}`;
            tpl.title = `${tpl.art.toUpperCase()} Deputad${!isMale&&'a'||'o'} ${tpl.fullName} ${titlePos} - ${_title}`;

            tpl.url += `/deputados/${tpl.fileName}.html`;
            tpl.type = isMale ? 'deputado' : 'deputada';
            tpl.typeCamel = tpl.type.substr(0,1).toUpperCase() + tpl.type.substr(1);
        }

        return tpl;
    };
};
