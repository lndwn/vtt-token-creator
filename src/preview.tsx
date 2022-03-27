import { MouseEvent, useEffect, useRef, useState } from "react";
import { OutputOptions } from "./options";
import chroma from "chroma-js";
import { saveAs } from "file-saver";

interface PreviewViewProps {
  width: number;
  height: number;
  imageToRender: HTMLImageElement | null;
  outputOptions: OutputOptions;
  clearPreview: () => void;
  setOutputOptions: (options: OutputOptions) => void;
}

export const PreviewView = (props: PreviewViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [offsetStart, setOffsetStart] = useState<[number, number]>([0, 0]);
  const [offsetEnd, setOffsetEnd] = useState<[number, number]>([0, 0]);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - left;
    const y = clientY - top;
    setOffsetStart([x, y]);
    setOffsetEnd([0, 0]);
  };
  const handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - left;
    const y = clientY - top;
    setOffsetEnd([x, y]);
  };

  useEffect(() => {
    const [sX, sY] = offsetStart;
    const [eX, eY] = offsetEnd;
    setOffset([eX - sX, eY - sY]);
  }, [offsetStart, offsetEnd]);

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef?.current ?? null;
      if (canvas && props.imageToRender) {
        const ctx = canvas.getContext("2d");
        let x = 0;
        let y = 0;

        // destination specs
        const dW = canvas.width;
        const dH = canvas.height;
        const dR = dW / dH;
        // console.log(`destination: ${dW} x ${dH}, ${dR}`);

        // source specs
        const sW = props.imageToRender.naturalWidth;
        const sH = props.imageToRender.naturalHeight;
        const sR = sW / sH;
        const small = sW < dW && sH < dH;
        // console.log(`source: ${sW} x ${sH}, ${sR}`);

        // computed specs
        let cW = sW;
        let cH = sH;
        if (props.outputOptions.fillMode === "fit") {
          if (sR === 1) {
            cW = small ? cW : dW;
            cH = small ? cH : dH;
            x = small ? (dW - cW) / 2 : 0;
            y = small ? (dW - cW) / 2 : 0;
          }
          if (sR > 1) {
            cW = small ? cW : dW;
            cH = cW / sR;
            x = small ? (dW - cW) / 2 : 0;
            y = (dH - cH) / 2;
          }
          if (sR < 1) {
            cH = small ? cH : dH;
            cW = cH * sR;
            x = (dW - cW) / 2;
            y = small ? (dH - cH) / 2 : 0;
          }
          const scale = parseInt(props.outputOptions.scale, 10);
          if (scale <= 400 && scale >= 0) {
            cW = (cW / 100) * scale;
            cH = (cH / 100) * scale;
            switch (props.outputOptions.position) {
              case "7":
                x = 0;
                y = 0;
                break;
              case "8":
                x = cW > dW ? 0 - (cW - dW) / 2 : (dW - cW) / 2;
                y = 0;
                break;
              case "9":
                x = dW - cW;
                y = 0;
                break;

              case "4":
                x = 0;
                y = cH > dH ? 0 - (cH - dH) / 2 : (dH - cH) / 2;
                break;

              case "6":
                x = dW - cW;
                y = cH > dH ? 0 - (cH - dH) / 2 : (dH - cH) / 2;
                break;

              case "3":
                x = dW - cW;
                y = dH - cH;
                break;
              case "2":
                x = cW > dW ? 0 - (cW - dW) / 2 : (dW - cW) / 2;
                y = dH - cH;
                break;
              case "1":
                x = 0;
                y = dH - cH;
                break;

              case "5":
              default:
                x = cW > dW ? dW / 2 - cW / 2 : (dW - cW) / 2;
                y = cH > dH ? dH / 2 - cH / 2 : (dH - cH) / 2;
                break;
            }
          }
        }
        if (props.outputOptions.fillMode === "cover") {
          if (sR === 1) {
            cW = dW;
            cH = dH;
            x = 0;
            y = 0;
          }
          if (sR > 1) {
            cH = dH;
            cW = cH * sR;
            x = (dW - cW) / 2;
            y = 0;
          }
          if (sR < 1) {
            cW = dW;
            cH = cW / sR;
            x = 0;
            y = (dH - cH) / 2;
          }
        }

        // drag offset
        // const [offsetX, offsetY] = offset;
        x = x + parseInt(props.outputOptions.offsetX, 10);
        y = y + parseInt(props.outputOptions.offsetY, 10);
        // console.log(`computed: ${cW} x ${cH} @ ${x} ${y}`);

        // render
        if (ctx) {
          ctx.globalAlpha = 1;
          ctx.clearRect(0, 0, dW, dH);
          ctx.save();

          // clipping
          if (props.outputOptions.mask) {
            ctx.beginPath();
            let region = new Path2D();
            region.arc(dW / 2, dH / 2, Math.min(dW, dH) / 2, 0, Math.PI * 2);
            ctx.clip(region);
          } else {
            ctx.restore();
          }

          ctx.drawImage(props.imageToRender, x, y, cW, cH);
          ctx.restore();
        }
      }
    };
    draw();
  }, [props.imageToRender, props.outputOptions, offset]);

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (canvasRef.current) {
      const imageType =
        props.outputOptions.bgMode !== "transparent" ? "jpg" : "png";
      const download = canvasRef.current.toDataURL(`image/${imageType}`);
      saveAs(download, `token.${imageType}`);
    }
  };

  return (
    <div className="preview">
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
      <button onClick={handleDownloadClick}>Download</button>
    </div>
  );
};
