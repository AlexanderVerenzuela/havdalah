/* =========================
   CONFIGURACIÓN GENERAL
========================= */
const STAGE_WIDTH = 1080;
const STAGE_HEIGHT = 1920;

/* =========================
   STAGE Y LAYER
========================= */
const stage = new Konva.Stage({
  container: 'canvas',
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT
});

const layer = new Konva.Layer();
stage.add(layer);

/* =========================
   FONDO
========================= */
const background = new Konva.Rect({
  x: 0,
  y: 0,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  fillLinearGradientStartPoint: { x: 0, y: 0 },
  fillLinearGradientEndPoint: { x: STAGE_WIDTH, y: STAGE_HEIGHT },
  fillLinearGradientColorStops: [0, '#0b123c', 1, '#121c5a']
});
layer.add(background);

/* =========================
   LOGO
========================= */
const logoImage = new Image();
logoImage.src = 'logo.png';

logoImage.onload = () => {
  const logo = new Konva.Image({
    image: logoImage,
    width: 220,
    height: 220,
    x: (STAGE_WIDTH - 220) / 2,
    y: 40
  });
  layer.add(logo);
  layer.draw();
};

/* =========================
   TEXTOS PRINCIPALES
========================= */
const titleText = new Konva.Text({
  text: 'LISTA DE SERVIDORES',
  x: 0,
  y: 300,
  width: STAGE_WIDTH,
  align: 'center',
  fontSize: 58,
  fontStyle: 'bold',
  fill: 'white'
});

const subtitleText = new Konva.Text({
  text: 'Havdalah',
  x: 0,
  y: 380,
  width: STAGE_WIDTH,
  align: 'center',
  fontFamily: "Oleo Script",
  fontSize: 120,
  fill: 'white'
});

/* ===== LÍDER (DOS LÍNEAS) ===== */
const leaderRoleText = new Konva.Text({
  text: 'LÍDER DE GRUPO',
  x: 0,
  y: 550,
  width: STAGE_WIDTH,
  align: 'center',
  fontSize: 50,
  fontStyle: 'bold',
  fill: '#f5c542'
});

const leaderNameText = new Konva.Text({
  text: '',
  x: 0,
  y: 595,
  width: STAGE_WIDTH,
  align: 'center',
  fontSize: 90,
  fill: '#f5c542'
});

const dateText = new Konva.Text({
  text: '',
  x: 0,
  y: 1620,
  width: STAGE_WIDTH,
  align: 'center',
  fontFamily: "Oleo Script",
  fontSize: 80,
  fill: 'white'
});

const timeText = new Konva.Text({
  text: '',
  x: 0,
  y: 1700,
  width: STAGE_WIDTH,
  align: 'center',
  fontFamily: "Oleo Script",
  fontSize: 80,
  fill: 'white'
});

layer.add(
  titleText,
  subtitleText,
  leaderRoleText,
  leaderNameText,
  dateText,
  timeText
);

/* =========================
   GRUPO DE FUNCIONES
========================= */
const rolesGroup = new Konva.Group({
  x: 140
});
layer.add(rolesGroup);

function drawRoles(roles) {
  rolesGroup.destroyChildren();

  const boxWidth = 800;
  const boxHeight = 140;
  const spacing = 30;

  const totalHeight =
    roles.length * boxHeight +
    (roles.length - 1) * spacing;

  const ROLES_TOP_LIMIT = 680;
  const ROLES_BOTTOM_LIMIT = 1550;
  const availableHeight = ROLES_BOTTOM_LIMIT - ROLES_TOP_LIMIT;

  const startY =
    ROLES_TOP_LIMIT + (availableHeight - totalHeight) / 2;

  rolesGroup.y(startY);

  let y = 0;

  roles.forEach(item => {
    const bg = new Konva.Rect({
      x: 0,
      y,
      width: boxWidth,
      height: boxHeight,
      cornerRadius: 40,
      fill: '#d4b24c'
    });

    const roleText = new Konva.Text({
      x: 40,
      y: y + 18,
      width: boxWidth - 80,
      text: item.funcion,
      fontSize: 38,
      fontStyle: 'bold',
      align: 'center',
      fill: '#0b123c'
    });

    const nameText = new Konva.Text({
      x: 40,
      y: y + 62,
      width: boxWidth - 80,
      text: item.nombre,
      fontSize: 45,
      align: 'center',
      fill: '#0b123c'
    });

    rolesGroup.add(bg, roleText, nameText);
    y += boxHeight + spacing;
  });

  layer.draw();
}

/* =========================
   FORMULARIO - ROLES
========================= */
function addRole(funcion = '', nombre = '') {
  const div = document.createElement('div');
  div.className = 'role';
  div.innerHTML = `
    <input placeholder="Función" value="${funcion}">
    <input placeholder="Nombre" value="${nombre}">
    <button onclick="this.parentElement.remove(); generate()">✖</button>
  `;
  document.getElementById('roles').appendChild(div);
}

/* =========================
   GENERAR IMAGEN
========================= */
function generate() {
  const leader = document.getElementById('leader').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  leaderNameText.text(leader);
  dateText.text(`Shabat ${date}`);
  timeText.text(time);

  const rolesInputs = document.querySelectorAll('#roles .role');
  const roles = [];

  rolesInputs.forEach(r => {
    const func = r.children[0].value;
    const name = r.children[1].value;

    if (func && name) {
      roles.push({ funcion: func, nombre: name });
    }
  });

  drawRoles(roles);
}

/* =========================
   DESCARGAR IMAGEN
========================= */
function download() {
  const link = document.createElement('a');
  link.download = 'programa-havdalah.png';
  link.href = stage.toDataURL({ pixelRatio: 2 });
  link.click();
}

/* =========================
   ESCALADO RESPONSIVE
========================= */
function scalePreview() {
  const preview = document.getElementById('preview');
  const canvas = document.getElementById('canvas');
  if (!preview) return;

  const scale = Math.min(
    preview.clientWidth / STAGE_WIDTH,
    preview.clientHeight / STAGE_HEIGHT
  );

  canvas.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scalePreview);
scalePreview();

/* =========================
   ROLES PREDETERMINADOS
========================= */
[
  'Altar y bienvenida',
  'Limpieza y arreglo de sillas',
  'Banners / Banderas / SS.HH (varones)',
  'Mesa de compartir / SS.HH (damas)'
].forEach(r => addRole(r, ''));
