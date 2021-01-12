import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Link from '../../../../data/correlation/Link';
import generateID from '../../../../data/utilities/generateID';
import ContextMenu from '../../../elements/ContextMenu';

const AdditionalColumnField = ({
  rowCorrelation,
  columnCorrelation,
  commonLinks,
  onEdit,
}) => {
  const contextRef = useRef();
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (commonLinks.some((commonLink) => commonLink.getPseudo() === true)) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [commonLinks]);

  const contextMenuHandler = useCallback(
    (e, rowData) => {
      e.preventDefault();
      contextRef.current.handleContextMenu(e, rowData);
    },
    [contextRef],
  );

  const onEditHandler = useCallback(
    (experimentType, action, commonLink) => {
      const pseudoLinkCountHSQC = rowCorrelation
        .getLinks()
        .filter(
          (link) =>
            link.getExperimentType() === 'hsqc' ||
            link.getExperimentType() === 'hmqc',
        ).length;

      if (action === 'add') {
        const pseudoLinkID = generateID();
        const pseudoExperimentID = generateID();
        const pseudoCommonLinkXAxis = new Link({
          experimentType,
          experimentID: pseudoExperimentID,
          atomType: [
            columnCorrelation.getAtomType(),
            rowCorrelation.getAtomType(),
          ],
          axis: 'x',
          match: [rowCorrelation.getIndex()],
          id: pseudoLinkID,
          pseudo: true,
        });
        const pseudoCommonLinkYAxis = new Link({
          experimentType,
          experimentID: pseudoExperimentID,
          atomType: [
            columnCorrelation.getAtomType(),
            rowCorrelation.getAtomType(),
          ],
          axis: 'y',
          match: [columnCorrelation.getIndex()],
          id: pseudoLinkID,
          pseudo: true,
        });
        rowCorrelation.addLink(pseudoCommonLinkYAxis);
        columnCorrelation.addLink(pseudoCommonLinkXAxis);
        if (!rowCorrelation.getEdited().protonsCount) {
          rowCorrelation.setProtonsCount([pseudoLinkCountHSQC + 1]);
        }
      } else if (action === 'remove') {
        rowCorrelation.removeLink(commonLink.getID());
        columnCorrelation.removeLink(commonLink.getID());
        if (!rowCorrelation.getEdited().protonsCount) {
          rowCorrelation.setProtonsCount(
            pseudoLinkCountHSQC - 1 > 0 ? [pseudoLinkCountHSQC - 1] : [],
          );
        }
      }

      onEdit(rowCorrelation, columnCorrelation);
    },
    [rowCorrelation, columnCorrelation, onEdit],
  );

  const contextMenu = useMemo(() => {
    // allow the edition of pseudo correlations and pseudo HSQC only (for now)
    // assumption here that only one pseudo HSQC can be added to a pseudo correlation
    const commonLinkHSQC = commonLinks.find(
      (commonLink) =>
        commonLink.experimentType === 'hsqc' && commonLink.getPseudo() === true,
    );

    return rowCorrelation.getPseudo() === true
      ? commonLinkHSQC
        ? [
            {
              label: 'remove HSQC',
              onClick: () => {
                onEditHandler('hsqc', 'remove', commonLinkHSQC);
              },
            },
          ]
        : [
            {
              label: 'add HSQC',
              onClick: () => {
                onEditHandler('hsqc', 'add');
              },
            },
          ]
      : [];
  }, [commonLinks, onEditHandler, rowCorrelation]);

  const content = useMemo(() => {
    const linkSet = new Set();
    commonLinks.forEach((commonLink) => {
      if (
        commonLink.getExperimentType() === 'hsqc' ||
        commonLink.getExperimentType() === 'hmqc'
      ) {
        linkSet.add(
          !commonLink.getSignal() || commonLink.getSignal().sign === 0
            ? 'S'
            : `S${commonLink.getSignal().sign === 1 ? '+' : '-'}`,
        );
      } else if (
        commonLink.getExperimentType() === 'hmbc' ||
        commonLink.getExperimentType() === 'cosy' ||
        commonLink.getExperimentType() === 'tocsy'
      ) {
        linkSet.add('M');
      } else if (
        commonLink.getExperimentType() === 'noesy' ||
        commonLink.getExperimentType() === 'roesy'
      ) {
        linkSet.add('NOE');
      }
    });

    return [...linkSet];
  }, [commonLinks]);

  return (
    <td
      onContextMenu={(e) => {
        if (contextMenu.length > 0) {
          contextMenuHandler(e, rowCorrelation);
        }
      }}
      style={isEdited ? { backgroundColor: '#F7F2E0' } : {}}
    >
      {content.join('/')}
      <ContextMenu ref={contextRef} context={contextMenu} />
    </td>
  );
};

export default AdditionalColumnField;
