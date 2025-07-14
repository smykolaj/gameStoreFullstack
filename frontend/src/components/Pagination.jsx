import {useTranslation} from "react-i18next";

const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords }) => {
    const {t} = useTranslation();

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                {t("previous")}
            </button>
            <span>
                {t('pagination_info', {
                    currentPage: currentPage,
                    totalPages: totalPages,
                    totalRecords: totalRecords,
                })}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                {t("next")}
            </button>
        </div>
    );
};

export default Pagination;
