/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { FaRegTrashAlt, FaLink, FaSearchPlus, FaEdit } from 'react-icons/fa';

import SelectUncontrolled from '../../elements/SelectUncontrolled';
import { useHighlight, useHighlightData } from '../../highlight';
import FormatNumber from '../../utility/FormatNumber';
import { SignalKinds } from '../extra/constants/SignalsKinds';

const HighlightedRowStyle = css`
  background-color: #ff6f0057;
`;

const ConstantlyHighlightedRowStyle = css`
  background-color: #f5f5dc;
`;

const selectStyle = {
  marginLeft: 2,
  marginRight: 2,
  border: 'none',
  height: '20px',
};

const RangesTableRow = ({
  rowData,
  onChangeKind,
  onDelete,
  onUnlink,
  onZoom,
  onEdit,
  onContextMenu,
  preferences,
}) => {
  const highlightIDs = useMemo(() => {
    return [].concat(
      [rowData.id],
      rowData.tableMetaInfo.id !== undefined ? [rowData.tableMetaInfo.id] : [],
      rowData.tableMetaInfo.signal &&
        rowData.tableMetaInfo.signal.multiplicity.split('').includes('m') &&
        rowData.diaID
        ? rowData.diaID
        : rowData.tableMetaInfo.signal && rowData.tableMetaInfo.signal.diaID
        ? rowData.tableMetaInfo.signal.diaID
        : [],
    );
  }, [rowData]);

  const highlight = useHighlight(highlightIDs);
  const highlightData = useHighlightData();

  const [showUnlinkButton, setShowUnlinkButton] = useState(false);
  const [highlightAtomCountLabel, setHighlightAtomCountLabel] = useState(false);

  useEffect(() => {
    const isLinked =
      (rowData.diaID && rowData.diaID.length > 0) ||
      (rowData.signal &&
        rowData.signal.map((signal) => signal.diaID).flat().length > 0);
    setShowUnlinkButton(isLinked);
  }, [rowData]);

  useEffect(() => {
    if (
      (highlightData.highlight.highlightedPermanently &&
        highlightData.highlight.highlightedPermanently.includes(
          rowData.tableMetaInfo.id !== undefined
            ? rowData.tableMetaInfo.id
            : rowData.id,
        )) ||
      (highlightData.highlight.highlighted &&
        highlightData.highlight.highlighted.includes(
          rowData.tableMetaInfo.id !== undefined
            ? `${rowData.tableMetaInfo.id}_row`
            : rowData.id,
        ))
    ) {
      setHighlightAtomCountLabel(true);
    } else {
      setHighlightAtomCountLabel(false);
    }
  }, [
    highlightData.highlight.highlighted,
    highlightData.highlight.highlightedPermanently,
    rowData.id,
    rowData.tableMetaInfo.id,
  ]);

  const rowSpanTags = useMemo(() => {
    return {
      rowSpan: rowData.tableMetaInfo.rowSpan,
      style:
        Object.prototype.hasOwnProperty.call(rowData.tableMetaInfo, 'hide') &&
        rowData.tableMetaInfo.hide === true
          ? { display: 'none' }
          : null,
    };
  }, [rowData.tableMetaInfo]);

  const stopPropagationOnClickTag = {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
  };

  const getOriginal = useCallback(() => {
    const _rowData = Object.assign({}, rowData);
    delete _rowData.tableMetaInfo;

    return _rowData;
  }, [rowData]);

  const handleOnUnlink = useCallback(
    (e) => {
      // event handling here in case of unlink button clicked
      // because it should still be able to activate the linkage mode
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setShowUnlinkButton(false);
      if (highlight.isActivePermanently) {
        highlight.click();
      }
      highlight.remove(
        highlightIDs.filter(
          (id) =>
            id !==
            (rowData.tableMetaInfo.id !== undefined
              ? rowData.tableMetaInfo.id
              : rowData.id),
        ),
      );
      onUnlink(getOriginal());
    },
    [
      getOriginal,
      highlight,
      highlightIDs,
      onUnlink,
      rowData.id,
      rowData.tableMetaInfo.id,
    ],
  );

  const handleOnDelete = useCallback(() => {
    // no manual event handling because it's already handled by stopPropagationOnClickTag
    handleOnUnlink();
    onDelete(getOriginal());
  }, [getOriginal, handleOnUnlink, onDelete]);

  const handleOnZoom = useCallback(() => {
    onZoom(getOriginal());
  }, [getOriginal, onZoom]);

  const handleOnEdit = useCallback(() => {
    onEdit(getOriginal());
  }, [getOriginal, onEdit]);

  const getShowPreference = (showKey) => {
    return preferences
      ? Object.prototype.hasOwnProperty.call(preferences, showKey) &&
          preferences[showKey] === true
      : false;
  };

  const applyFormatPreference = (
    formatKey,
    value,
    prefix = '',
    suffix = '',
  ) => {
    const format =
      preferences &&
      Object.prototype.hasOwnProperty.call(preferences, formatKey)
        ? preferences[formatKey]
        : null;
    return format ? FormatNumber(value, format, prefix, suffix) : value;
  };

  return (
    <tr
      onContextMenu={(e) => onContextMenu(e, getOriginal())}
      css={
        highlight.isActive || highlight.isActivePermanently
          ? HighlightedRowStyle
          : Object.prototype.hasOwnProperty.call(
              rowData.tableMetaInfo,
              'isConstantlyHighlighted',
            ) && rowData.tableMetaInfo.isConstantlyHighlighted === true
          ? ConstantlyHighlightedRowStyle
          : null
      }
      {...highlight.onHover}
      {...highlight.onClick}
    >
      <td {...rowSpanTags}>{rowData.tableMetaInfo.index}</td>
      {getShowPreference('showFrom') ? (
        <td {...rowSpanTags}>
          {applyFormatPreference('fromFormat', rowData.from)}
        </td>
      ) : null}
      {getShowPreference('showTo') ? (
        <td {...rowSpanTags}>
          {applyFormatPreference('toFormat', rowData.to)}
        </td>
      ) : null}
      <td>
        {rowData.tableMetaInfo.signal
          ? rowData.tableMetaInfo.signal.multiplicity === 'm'
            ? `${applyFormatPreference(
                'fromFormat',
                rowData.from,
              )} - ${applyFormatPreference('toFormat', rowData.to)}`
            : rowData.tableMetaInfo.signal.delta.toFixed(3)
          : ''}
      </td>
      {getShowPreference('showRelative') ? (
        <td {...rowSpanTags}>
          {rowData.kind === 'signal'
            ? applyFormatPreference('relativeFormat', rowData.integral)
            : applyFormatPreference(
                'relativeFormat',
                rowData.integral,
                '[',
                ']',
              )}
        </td>
      ) : null}
      {getShowPreference('showAbsolute') ? (
        <td {...rowSpanTags}>
          {applyFormatPreference('absoluteFormat', rowData.absolute)}
        </td>
      ) : null}
      <td>
        {rowData.tableMetaInfo.signal
          ? rowData.tableMetaInfo.signal.multiplicity
          : ''}
      </td>
      <td>
        {rowData.tableMetaInfo.signal && rowData.tableMetaInfo.signal.j
          ? rowData.tableMetaInfo.signal.j
              .map((coupling) => coupling.coupling.toFixed(1))
              .join(', ')
          : ''}
      </td>
      <td
        style={{
          color: highlightAtomCountLabel ? 'red' : 'black',
        }}
      >
        {rowData.tableMetaInfo.signal &&
        rowData.tableMetaInfo.signal.multiplicity &&
        rowData.tableMetaInfo.signal.multiplicity.split('').includes('m')
          ? rowData.diaID && rowData.diaID.length > 0
            ? rowData.diaID.length
            : highlightAtomCountLabel
            ? '0'
            : ''
          : rowData.tableMetaInfo.signal &&
            rowData.tableMetaInfo.signal.diaID &&
            rowData.tableMetaInfo.signal.diaID.length > 0
          ? rowData.tableMetaInfo.signal.diaID.length
          : highlightAtomCountLabel
          ? '0'
          : ''}
      </td>
      <td {...rowSpanTags}>
        {showUnlinkButton || highlight.isActivePermanently ? (
          <span>
            <button
              type="button"
              className="unlink-button"
              onClick={handleOnUnlink}
            >
              <FaLink color={highlight.isActivePermanently ? 'red' : 'black'} />
            </button>
            <sup>[{rowData.pubIntegral}]</sup>
          </span>
        ) : null}
      </td>
      <td {...rowSpanTags} {...stopPropagationOnClickTag}>
        <SelectUncontrolled
          onChange={(value) => {
            onChangeKind(value, getOriginal());
          }}
          data={SignalKinds}
          value={rowData.kind}
          style={selectStyle}
        />
      </td>
      <td {...rowSpanTags} {...stopPropagationOnClickTag}>
        <button
          type="button"
          className="delete-button"
          onClick={handleOnDelete}
        >
          <FaRegTrashAlt />
        </button>
      </td>
      <td {...rowSpanTags} {...stopPropagationOnClickTag}>
        <button type="button" className="zoom-button" onClick={handleOnZoom}>
          <FaSearchPlus />
        </button>
      </td>
      <td {...rowSpanTags} {...stopPropagationOnClickTag}>
        <button type="button" className="edit-button" onClick={handleOnEdit}>
          <FaEdit color="blue" />
        </button>
      </td>
    </tr>
  );
};

export default RangesTableRow;
