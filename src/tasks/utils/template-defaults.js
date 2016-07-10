'use strict';
const pathsFactory = require('./paths');

const $title = 'Fim do Foro Privilegiado';
const $description = [
    'Ajude o Movimento Brasil Livre a pressionar os deputados pelo fim do Foro Especial por Prerrogativa de Função, mais conhecido como Foro Privilegiado.'
].join(' ');

module.exports = ($datum) => {
    if (!$datum) $datum = {path: 'foro'};

    let paths = pathsFactory($datum);

    if (!$datum.keywords || !~$datum.keywords.indexOf('mbl.org.br')) {
        $datum.keywords = [
            $datum.keywords,
            'foro', 'privilegiado', 'impunidade',
            'movimento', 'brasil', 'livre', 'mbl', 'mbl.org.br', 'mblivre'
        ].filter(k => !!k).join(',');
    }

    return (obj) => {
        let baseUrl = paths.url,
            _title = $title;
        let tpl = obj || {};

        tpl.state = $datum.state;
        tpl.version = paths.pack.version;
        tpl.title = _title;
        tpl.baseUrl = baseUrl;
        tpl.url = baseUrl;
        tpl.desc = $datum.desc || $description;
        tpl.keywords = $datum.keywords;
        tpl.imageUrl = `/images/logo-social-512-380-${tpl.version}.jpg`;
        if (tpl.fullName) {
            let isMale = tpl.gender.trim() === 'M',
                vote = tpl.vote;
            tpl.o = isMale ? 'o' : 'a';
            tpl.ele = isMale ? 'ele' : 'ela';
            tpl.pos = vote && 'a favor' || (vote === false && 'contra' || 'ignorando');
            let titlePos = `${vote === undefined ? 'está' : 'é'} ${tpl.pos}`;

            let type = tpl.dir === 'deputados' ? `Deputad${!isMale&&'a'||'o'}` : `Senador${!isMale&&'a'||''}`;
            tpl.title = `${tpl.o.toUpperCase()} ${type} ${tpl.fullName} ${titlePos} - ${_title}`;

            tpl.url += `/${tpl.dir}/${tpl.fileName}.html`;
            tpl.type = type.toLowerCase();
            tpl.typeCamel = type;
        }

        return tpl;
    };
};
