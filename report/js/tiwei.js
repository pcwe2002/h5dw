function paintTiWei(dwdata, evt, draw) {
  const { npx, dpr, DrawBox, ctx } = draw; //用于缩放

  const { left, top, width, height } = evt.view;

  // draw.line([left, top + 5], [left + width, top + 5]);
  // draw.line([left + 5, top + 5], [left + 5, top + height - 5]);
  const Left = left,
    Top = top,
    Width = width,
    Height = height;
  const Bottom = top + height;
  const Right = left + width;
  const Days = 7; //天数
  const BeginDate = new Date("2012-5-27"); //开始日期
  const BeginHour = 4; //开始小时

  const HourSpan = 4, //每次之间小时间隔
    MaxTemp = 42, //最大温度
    MinTemp = 34, //最小温度
    TempScale = 5, //1度的刻度数
    HourScale = 24 / HourSpan, //每天的小时刻度数
    RowHeight = 20, //默认的行高度，底部文字行的高度
    MeiBoColWidth = 40, //脉搏列的宽度
    TempColWidth = 75, //温度列的宽度
    OutColWidth = 20, //出量列的宽度
    BottomRows = 11, //下部行数，不包括呼吸次数行
    TitleRowHeight = RowHeight + 10, //表头(脉搏、体温与小时文字)行高
    FuxiRowHeight = RowHeight + 10, //呼吸行的高度
    GridCols = Days * (24 / HourSpan), //网格列数
    GridRows = (MaxTemp - MinTemp) * TempScale + 3, //网格行数，顶部多3行
    TitleTop = top + RowHeight, //标题(即日期行)的上部位置
    FuxiBottom = top + (height - BottomRows * RowHeight), //呼吸行的底部位置
    GridLeft = left + MeiBoColWidth + TempColWidth, //网格左边位置
    GridRight = left + width, //网格右边位置
    GridTop = TitleTop + TitleRowHeight, //网格顶边位置
    GridBottom = FuxiBottom - FuxiRowHeight, //网格底边位置
    GridWidth = GridRight - GridLeft, //网格的宽度
    GridHeight = GridBottom - GridTop, //网格的高度
    GridRowHeight = GridHeight / GridRows, //网格的行宽度
    GridColWidth = GridWidth / GridCols, //网格的列宽度
    SquareSize = 8; //数据点的正方形区域边长

  draw.save();

  draw.attr({ lineWidth: 0.5, strokeStyle: "rgba(0,0,0,1)" });

  // //首先画表格头横线
  draw.line([Left, TitleTop], [GridRight, TitleTop]);
  draw.line([Left, GridTop], [GridRight, GridTop]);

  //<<画底部的行线
  //画呼吸次数下的行线
  let y = GridBottom,
    x = 0;
  draw.line([left, y], [GridRight, y]);

  y = FuxiBottom;
  for (i = 0; i < BottomRows; ++i) {
    x = left;
    if (i >= 3 && i < 8) x += OutColWidth;
    draw.line([x, y], [GridRight, y]);
    y += RowHeight;
  }

  //画"出量"列的竖线
  x = left + OutColWidth;
  draw.line([x, FuxiBottom + RowHeight * 2], [x, FuxiBottom + RowHeight * 8]);

  //画前2列的竖线
  x = left + MeiBoColWidth;
  draw.line([x, TitleTop], [x, GridBottom]);
  x += TempColWidth;
  draw.line([x, Top], [x, Bottom]);
  //}}画表格黑色线//////////////////////////////////////////////////

  //{{画Grid的线段//////////////////////////////////////////////////
  draw.attr({ lineWidth: 0.5, strokeStyle: "rgba(0,0,0,1)" });
  //画细横线
  y = GridTop + GridRowHeight;
  for (i = 1; i < GridRows; ++i) {
    if ((i + 2) % TempScale != 0) {
      draw.line([GridLeft, y], [GridRight, y]);
    }
    y += GridRowHeight;
  }

  //画细竖线
  x = GridLeft + GridColWidth;
  for (i = 1; i < GridCols; ++i) {
    if (i % HourScale != 0) {
      draw.line([x, TitleTop], [x, FuxiBottom]);
    }
    x += GridColWidth;
  }

  //画粗横线
  draw.attr({ lineWidth: 1.5, strokeStyle: "rgba(0,0,0,1)" });
  y = GridTop + GridRowHeight * 3;
  for (i = 3; i < GridRows; i += TempScale) {
    draw.line([GridLeft, y], [GridRight, y]);
    y += GridRowHeight * TempScale;
  }

  //画粗竖线
  draw.attr({ lineWidth: 1.5, strokeStyle: "rgba(255,0,0,1)" });
  x = GridLeft + GridColWidth * HourScale;
  for (i = HourScale; i < GridCols; i += HourScale) {
    draw.line([x, Top], [x, Bottom]);
    x += GridColWidth * HourScale;
  }

  //}}画Grid的线段//////////////////////////////////////////////////

  //{{输出静态文字//////////////////////////////////////////////////
  //<<第一行,即日期行
  x = Left;
  y = Top;
  let w = GridLeft;
  let h = RowHeight;
  draw.text("日  期", new DrawBox(x, y, w, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });

  // TempDateParam.AsDateTime = BeginDateParam.AsDateTime;
  year = "";
  month = "";
  x = GridLeft;
  w = GridColWidth * HourScale;
  let dt = new Date(BeginDate);
  for (i = 0; i < Days; ++i) {
    DateText = dt.format("yyyyMMdd");
    cur_year = DateText.substr(0, 4);
    cur_month = DateText.substr(4, 2);
    cur_day = DateText.substr(6);
    DateText = "";
    if (year != cur_year) {
      year = cur_year;
      DateText = year + ".";
    }
    if (month != cur_month) {
      month = cur_month;
      DateText += month + ".";
    }
    DateText += cur_day;

    draw.text(DateText, new DrawBox(x, y, w, h), {
      font: { size: 13 },
      align: "center",
      valign: "middle",
    });
    // Graphics.DrawText(DateText, x, y, w, h, 34, false);

    x += w;
    dt.setDate(dt.getDate() + 1);
    // TempDateParam.AsInteger += 1;
  }
  //>>第一行,即日期行

  //<<第二行,即脉搏、体温，小时行
  x = Left;
  y = TitleTop;
  w = MeiBoColWidth;
  h = TitleRowHeight;
  draw.text("脉搏", new DrawBox(x, y, w, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });
  x = Left + MeiBoColWidth;
  w = TempColWidth;
  draw.text("体温", new DrawBox(x, y, w, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });

  //小时,这里需要改小字体
  // Font = Sender.Font.Clone(); //注意：一定要调用Clone方法，不然会影响到部件框本身的字体定义
  // Font.Point = 7.5;
  // Graphics.SelectFont(Font);
  w = GridColWidth;
  let tmpHour;
  for (i = 0; i < Days; ++i) {
    x = GridLeft + GridColWidth * i * HourScale;
    tmpHour = BeginHour;
    for (j = 0; j < HourScale; ++j) {
      OutText = "" + tmpHour;
      draw.text(OutText, new DrawBox(x, y, w, h), {
        font: { size: 11 },
        align: "center",
        valign: "middle",
      });
      x += GridColWidth;
      tmpHour += HourSpan;
      if (tmpHour > 24) {
        tmpHour %= 24;
      }
    }
  }
  // Graphics.RestoreFont();
  //>>第二行,即脉搏、体温，小时行

  //<<脉搏文字列: 画出脉搏列的度量文字
  //         Font.Point = 9; //7.5; //75000;
  //         Graphics.SelectFont(Font);
  //         Graphics.SelectTextColor(Report.Utility.ColorFromRGB(255, 0, 0));
  x = Left;
  w = MeiBoColWidth;
  h = GridRowHeight * 2;
  y = GridTop + GridRowHeight * 2;
  tmpHour = 180;
  for (i = 0; i <= MaxTemp - MinTemp; ++i) {
    HourText = "" + tmpHour;
    // Graphics.DrawText(HourText, x, y, w, h, 34, false);
    draw.text(HourText, new DrawBox(x, y, w, h), {
      font: { size: 11 },
      color: "red",
      align: "center",
      valign: "middle",
    });
    y += GridRowHeight * TempScale;
    if (i + 1 == MaxTemp - MinTemp) y -= GridRowHeight;
    tmpHour -= 20;
  }
  //>>脉搏文字列: 画出脉搏列的度量文字

  //<<体温文字列: 画出体温的度量文字
  x = Left + MeiBoColWidth;
  w = (TempColWidth * 3) / 5;
  h = GridRowHeight * 2;
  y = GridTop;
  x2 = x + w;
  w2 = TempColWidth - w;

  draw.text("F", new DrawBox(x, y, w, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });
  draw.text("C", new DrawBox(x2, y, w2, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });

  y += h;
  for (i = MaxTemp; i >= MinTemp; --i) {
    tmpHour = i * 1.8 + 32; // ℃ × 1.8 + 32
    OutText = "" + tmpHour.toFixed(1);
    draw.text(OutText, new DrawBox(x, y, w, h), {
      font: { size: 13 },
      align: "center",
      valign: "middle",
    });

    OutText = "" + i;
    draw.text(OutText, new DrawBox(x2, y, w2, h), {
      font: { size: 13 },
      align: "center",
      valign: "middle",
    });

    y += GridRowHeight * TempScale;
    if (i - 1 == MinTemp) y -= GridRowHeight;
  }
  //>>体温文字列: 画出体温的度量文字
  //}}输出静态文字//////////////////////////////////////////////////

  //{{输出动态数据//////////////////
  //呼吸次数前面文字
  x = Left;
  y = GridBottom;
  w = MeiBoColWidth + TempColWidth;
  h = FuxiRowHeight;
  draw.text("呼吸(次/分)", new DrawBox(x, y, w, h), {
    font: { size: 13 },
    align: "center",
    valign: "middle",
  });

  //输出呼吸次数与备注数据
  //         Font.Point = 7; //7.5
  //         Graphics.SelectFont(Font);
  w = GridColWidth;
  h = FuxiRowHeight / 2;
  y = GridBottom;

  for (const data of dwdata) {
    const riqi = new Date(data.riqi);
    const fuxi = parseInt(data.fuxi);
    const times = parseInt(data.times);
    const beizhu = data.beizhu;
    ColNo = ((riqi - BeginDate) / 86400000) * HourScale + times - 1;
    x = GridLeft + GridColWidth * ColNo;

    //呼吸次数数据
    if (fuxi > 0) {
      y = GridBottom;
      if (ColNo % 2 != 0) y += h;
      OutText = fuxi + "";
      draw.text(OutText, new DrawBox(x + 1, y, w, h), {
        font: { size: 11 },
        align: "center",
        valign: "middle",
      });
    }

    //输出备注文字数据
    if (!!beizhu) {
      //(OutText != "")
      OutText = beizhu;
      y = GridTop + 3 * GridRowHeight + 2;
      // TextFormat.TextOrientation = 5; //grtoU2DL2R0 5
      // TextFormat.TextAlign = 18; //grtaTopLeft=17  grtaTopCenter=18
      // Graphics.DrawFormatText(OutText, x + 1, y, w, GridHeight, TextFormat);
      draw.text(OutText, new DrawBox(x + 1, y, w, h), {
        font: { size: 11 },
        align: "center",
        valign: "top",
      });
    }
  }

  //<<输出脉搏图形
  // Graphics.SelectPen(1, Report.Utility.ColorFromRGB(255, 0, 0), 0);
  // Graphics.SelectFillColor(Report.Utility.ColorFromRGB(255, 0, 0));

  xPrior = 0;
  yPrior = 0;
  for (const data of dwdata) {
    const riqi = new Date(data.riqi);
    const fuxi = parseInt(data.fuxi);
    const times = parseInt(data.times);
    const val = parseFloat(data.maibo);
    if (val > 0) {
      ColNo = ((riqi - BeginDate) / 86400000) * HourScale + times - 1;
      x = GridLeft + GridColWidth * ColNo + GridColWidth / 2;
      y = GridTop + (((180.0 - val) * TempScale) / 20 + 3) * GridRowHeight;

      //连线
      if (xPrior > 0) {
        draw.line([xPrior, yPrior], [x, y]);
      }
      xPrior = x;
      yPrior = y;

      // draw.ctx.ellipse(npx(x - SquareSize / 2), npx(y - SquareSize / 2), npx(SquareSize), npx(SquareSize), 0, 0, Math.PI * 2);
      // draw.ctx.fillStyle = 'red';
      // draw.ctx.fill();
    }

    // Recordset.Next();
  }

  //>>输出脉搏图形

  //<<输出体温图形
  xPrior = 0;
  yPrior = 0;
  draw.ctx.strokeStyle = "black";
  for (const data of dwdata) {
    const riqi = new Date(data.riqi);
    const times = parseInt(data.times);
    const val = parseFloat(data.tiwen);
    if (val > 0) {
      ColNo = ((riqi - BeginDate) / 86400000) * HourScale + times - 1;
      x = GridLeft + GridColWidth * ColNo + GridColWidth / 2;
      y = GridTop + ((MaxTemp - val) * TempScale + 3) * GridRowHeight;

      //连线
      const y1 = y + SquareSize / 2;
      if (xPrior > 0) {
        draw.line([xPrior, yPrior], [x, y1]);
      }
      xPrior = x + SquareSize;
      yPrior = y1;

      x -= SquareSize / 2;
      y -= SquareSize / 2;
      draw.ctx.fillStyle = "white";
      draw.fillRect(x - 1, y - 1, SquareSize + 2, SquareSize + 2);
      draw.line([x, y], [x + SquareSize, y + SquareSize]);
      draw.line([x + SquareSize, y], [x, y + SquareSize]);
      // Graphics.FillRect(x - 1, y - 1, SquareSize + 2, SquareSize + 2, Report.Utility.ColorFromRGB(255, 255, 255));
      // Graphics.MoveTo(x, y);
      // Graphics.LineTo(x + SquareSize, y + SquareSize);
      // Graphics.MoveTo(x + SquareSize, y);
      // Graphics.LineTo(x, y + SquareSize);
    }
  }
  //>>输出体温图形

  //输出底部行的文字
  x = Left;
  y = FuxiBottom;
  w = MeiBoColWidth + TempColWidth;
  h = RowHeight;
  x2 = x + OutColWidth;
  w2 = w - OutColWidth;
  draw.ctx.fillStyle = "black";
  const textFormat = { font: { size: 13 }, align: "center", valign: "middle" };
  draw.text("特 殊 治 疗", new DrawBox(x, y + RowHeight * 0, w, h), textFormat);
  draw.text("大 便 次 数", new DrawBox(x, y + RowHeight * 1, w, h), textFormat);
  draw.text(
    "尿 量(毫升)",
    new DrawBox(x2, y + RowHeight * 2, w2, h),
    textFormat
  );
  draw.text(
    "痰 量(毫升)",
    new DrawBox(x2, y + RowHeight * 3, w2, h),
    textFormat
  );
  draw.text(
    "引流量(毫升)",
    new DrawBox(x2, y + RowHeight * 4, w2, h),
    textFormat
  );
  draw.text(
    "呕吐量(毫升)",
    new DrawBox(x2, y + RowHeight * 5, w2, h),
    textFormat
  );
  draw.text(
    "总 量(毫升)",
    new DrawBox(x2, y + RowHeight * 6, w2, h),
    textFormat
  );
  draw.text("入 量(毫升)", new DrawBox(x, y + RowHeight * 7, w, h), textFormat);
  draw.text("血压(mmHg)", new DrawBox(x, y + RowHeight * 8, w, h), textFormat);
  draw.text("体 重(Kg)", new DrawBox(x, y + RowHeight * 9, w, h), textFormat);
  draw.text("手术后天数", new DrawBox(x, y + RowHeight * 10, w, h), textFormat);

  x = Left;
  y = FuxiBottom + RowHeight * 2;
  w = OutColWidth;
  h = RowHeight * 5;
  // TextFormat.TextOrientation = 5; //grtoU2DL2R0 5
  // TextFormat.TextAlign = 17; //grtaTopLeft  17
  // Graphics.DrawFormatText("出    量", x + 4, y + 20, w, GridHeight, TextFormat);

  //输出体温图形
  //           Recordset.First();
  textFormat.font.size = 12;
  for (const data of dwdata) {
    const times = parseInt(data.times);
    const riqi = new Date(data.riqi);
    const val = parseFloat(data.tiwen);
    const { tszl, dbcs, cll, ctl, cyll, cotl, czl, rl, xueya, tizhong, ssts } =
      data;

    //数据假设都是记录在每天的第一次数据上
    if (times == 1) {
      x =
        GridLeft + ((GridColWidth * (riqi - BeginDate)) / 86400000) * HourScale;
      y = FuxiBottom;
      w = GridColWidth * HourScale;
      h = RowHeight;
      if (tszl)
        draw.text(tszl, new DrawBox(x, y + RowHeight * 0, w, h), textFormat);
      if (dbcs)
        draw.text(dbcs, new DrawBox(x, y + RowHeight * 1, w, h), textFormat);
      if (cll)
        draw.text(cll, new DrawBox(x, y + RowHeight * 2, w, h), textFormat);
      if (ctl)
        draw.text(ctl, new DrawBox(x, y + RowHeight * 3, w, h), textFormat);
      if (cyll)
        draw.text(cyll, new DrawBox(x, y + RowHeight * 4, w, h), textFormat);
      if (cotl)
        draw.text(cotl, new DrawBox(x, y + RowHeight * 5, w, h), textFormat);
      if (czl)
        draw.text(czl, new DrawBox(x, y + RowHeight * 6, w, h), textFormat);
      if (rl)
        draw.text(rl, new DrawBox(x, y + RowHeight * 7, w, h), textFormat);
      if (xueya)
        draw.text(xueya, new DrawBox(x, y + RowHeight * 8, w, h), textFormat);
      if (tizhong)
        draw.text(tizhong, new DrawBox(x, y + RowHeight * 9, w, h), textFormat);
      if (ssts)
        draw.text(ssts, new DrawBox(x, y + RowHeight * 10, w, h), textFormat);
    }
  }
  //}}输出动态数据//////////////////

  draw.restore();
}
