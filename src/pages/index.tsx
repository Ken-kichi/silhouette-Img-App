import  { useEffect, useState } from 'react';
import init,{convert_to_silhouette} from '../webassembly'

const App = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(()=>{
        init();
    },[])

    const convertToSilhouette = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const imgData = new Uint8Array(reader.result as ArrayBuffer);

            // 画像をシルエットに変換するWebAssembly関数を呼び出す
            const silhouetteImgData = convert_to_silhouette(imgData);

            // シルエット画像データをデータURLに変換
            const blob = new Blob([silhouetteImgData], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        };

        reader.readAsArrayBuffer(file);
    };

    const downloadSilhouette = () => {
        if (!imageUrl) return;
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'silhouette.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <input type="file" onChange={convertToSilhouette} />
            {imageUrl && <img src={imageUrl} alt="Silhouette" style={{ maxWidth: '500px', maxHeight: '500px' }} />}
            {imageUrl && <button onClick={downloadSilhouette}>Download Silhouette</button>}
        </div>
    );
};

export default App;
