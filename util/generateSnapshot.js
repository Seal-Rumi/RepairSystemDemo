const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function generateGLBSnapshot(glbPath, outputPath) {
  if (!fs.existsSync(glbPath)) {
    console.error("GLB file not found:", glbPath);
    return;
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const content = `
    <html>
      <body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three/examples/js/loaders/GLTFLoader.js"></script>
        <script>
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
          camera.position.z = 2;

          const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
          renderer.setSize(512, 512);
          document.body.appendChild(renderer.domElement);

          const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
          scene.add(light);

          const loader = new THREE.GLTFLoader();
          loader.load('${glbPath}', (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            scene.add(model);

            renderer.render(scene, camera);

            setTimeout(() => {
              const base64Data = renderer.domElement.toDataURL().replace(/^data:image\\/png;base64,/, "");
              window.snapshot = base64Data;
            }, 1000);
          }, undefined, (error) => {
            console.error("Error loading GLB file:", error);
          });
        </script>
      </body>
    </html>
  `;

  await page.setContent(content, { waitUntil: "networkidle0" });

  try {
    await page.waitForFunction(() => window.snapshot, { timeout: 60000 });
    const base64Data = await page.evaluate(() => window.snapshot);

    fs.writeFileSync(outputPath, base64Data, "base64");
    console.log(`Snapshot saved to ${outputPath}`);
  } catch (err) {
    console.error("Error generating snapshot:", err);
  } finally {
    await browser.close();
  }
}

// 使用示例
const model_url = "model/glb_1731310584511.glb"; // 替換成你的模型路徑
let glbPath = path.join(__dirname, `../media/mediaRepo/${model_url}`);

// 確保使用正確的 URI 格式，將 '\' 替換為 '/'
glbPath = `${glbPath.replace(/\\/g, "/")}`;

const outputPath = path.resolve(__dirname, "snapshot.png");

generateGLBSnapshot(glbPath, outputPath);
