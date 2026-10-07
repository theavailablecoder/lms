import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import AuthLayout from "../../components/auth/AuthLayout.jsx";
import CompanyBrand from "../../components/shared/CompanyBrand.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function TeacherRegistrationPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teacher_name: "",
      teacher_mobile: "",
      teacher_email: "",
      teacher_password: "",
      teacher_password_confirmation: "",

      school_name: "",
      school_address: "",
      personal_address: "",

      principal_name: "",
      dob: "",

      session_start: "",

      representative_name: "",
      representative_contact: "",

      board_id: "",
      class_ids: [],
      selected_subjects: [],
      subject_books: [],
    },
  });

  // AUTH CONTEXT
  const {
    boards,
    classes,
    subjects,
    booksBySubject,

    loadingRegistrationData,
    loadingSubjects,
    loadingBooks,

    loadTeacherRegistrationData,
    loadSubjects,
    loadBooks,

    createTeacher,
    error: authError,
  } = useAuth();

  // FORM VALUES
  const password = watch("teacher_password");

  const boardId = watch("board_id");

  const classIds = watch("class_ids") || [];

  const selectedSubjects = watch("selected_subjects") || [];

  const subjectBooks = watch("subject_books") || [];

  // PAGE STATE
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // LOAD BOARDS + CLASSES
  useEffect(() => {
    loadTeacherRegistrationData().catch(() => {});
  }, []);

  // COMBINED ERROR
  const displayError = apiError || authError;

  // BOARD CHANGE
  const handleBoardChange = async (event) => {
    const id = event.target.value;

    // Set selected board
    setValue("board_id", id);

    // Reset subjects
    setValue("selected_subjects", []);

    // Reset books
    setValue("subject_books", []);

    setApiError("");

    if (!id) {
      return;
    }

    try {
      await loadSubjects(id);
    } catch (error) {
      console.error("Unable to load subjects:", error);
    }
  };

  // CLASS CHANGE
  const handleClassChange = (classId, checked) => {
    const id = String(classId);

    const current = classIds || [];

    if (checked) {
      if (!current.includes(id)) {
        setValue("class_ids", [...current, id]);
      }
    } else {
      setValue(
        "class_ids",
        current.filter((item) => item !== id),
      );
    }
  };

  // SUBJECT CHANGE
  const handleSubjectChange = async (subjectId, checked) => {
    const id = String(subjectId);

    const current = selectedSubjects || [];

    setApiError("");

    // REMOVE SUBJECT
    if (!checked) {
      setValue(
        "selected_subjects",
        current.filter((item) => item !== id),
      );

      // Remove books belonging to this subject
      setValue(
        "subject_books",
        subjectBooks.filter((item) => String(item.subject_id) !== id),
      );

      return;
    }

    // ADD SUBJECT
    if (!current.includes(id)) {
      setValue("selected_subjects", [...current, id]);
    }

    // LOAD BOOKS
    try {
      await loadBooks(subjectId);
    } catch (error) {
      console.error("Unable to load books:", error);
    }
  };

  // BOOK CHANGE
  const handleBookChange = (subjectId, bookId, checked) => {
    const subjectKey = String(subjectId);

    const bookKey = String(bookId);

    const currentBooks = subjectBooks || [];

    const subjectIndex = currentBooks.findIndex(
      (item) => String(item.subject_id) === subjectKey,
    );

    // BOOK CHECKED
    if (checked) {
      // Subject doesn't exist in subject_books yet
      if (subjectIndex === -1) {
        setValue("subject_books", [
          ...currentBooks,
          {
            subject_id: subjectKey,
            book_ids: [bookKey],
          },
        ]);

        return;
      }

      // Subject already exists
      const updated = [...currentBooks];

      const existingBooks = updated[subjectIndex].book_ids || [];

      if (!existingBooks.includes(bookKey)) {
        updated[subjectIndex] = {
          ...updated[subjectIndex],
          book_ids: [...existingBooks, bookKey],
        };
      }

      setValue("subject_books", updated);

      return;
    }

    // BOOK UNCHECKED
    if (subjectIndex === -1) {
      return;
    }

    const updated = [...currentBooks];

    updated[subjectIndex] = {
      ...updated[subjectIndex],
      book_ids: (updated[subjectIndex].book_ids || []).filter(
        (id) => id !== bookKey,
      ),
    };

    setValue("subject_books", updated);
  };

  // DROPDOWN TEXT
  const getDropdownText = (items, emptyText, selectedText) => {
    if (!items.length) {
      return emptyText;
    }

    return `${items.length} ${selectedText}`;
  };

  // BOOK DROPDOWN TEXT
  const getBookDropdownText = (subjectId) => {
    const subjectKey = String(subjectId);

    const books = booksBySubject?.[subjectKey];

    const subjectData = subjectBooks.find(
      (item) => String(item.subject_id) === subjectKey,
    );

    const selected = subjectData?.book_ids || [];

    if (loadingBooks?.[subjectKey]) {
      return "Loading books...";
    }

    if (!books) {
      return "Select books";
    }

    if (!books.length) {
      return "No books available";
    }

    return getDropdownText(selected, "Select books", "books selected");
  };

  // FORM SUBMIT
  const onSubmit = async (formData) => {
    setApiError("");
    setSuccessMessage("");

    // PASSWORD VALIDATION
    if (formData.teacher_password !== formData.teacher_password_confirmation) {
      setError("teacher_password_confirmation", {
        type: "manual",
        message: "Passwords do not match.",
      });

      return;
    }

    // CLASS VALIDATION
    if (!formData.class_ids?.length) {
      setApiError("Please select at least one class.");

      return;
    }

    // SUBJECT VALIDATION
    if (!formData.selected_subjects?.length) {
      setApiError("Please select at least one subject.");

      return;
    }

    // BOOK VALIDATION
    const missingBook = formData.selected_subjects.some((subjectId) => {
      const subject = formData.subject_books?.find(
        (item) => String(item.subject_id) === String(subjectId),
      );

      return !subject?.book_ids?.length;
    });

    if (missingBook) {
      setApiError(
        "Please select at least one book for every selected subject.",
      );

      return;
    }

    // LARAVEL DATA
    const teacherData = {
      teacher_name: formData.teacher_name.trim(),

      teacher_mobile: formData.teacher_mobile.trim(),

      teacher_password: formData.teacher_password,

      teacher_password_confirmation: formData.teacher_password_confirmation,

      teacher_email: formData.teacher_email.trim(),

      school_name: formData.school_name.trim(),

      school_address: formData.school_address.trim(),

      personal_address: formData.personal_address.trim(),

      principal_name: formData.principal_name.trim(),

      dob: formData.dob,

      session_start: formData.session_start,

      representative_name: formData.representative_name.trim(),

      representative_contact: formData.representative_contact.trim(),

      status: "inactive",

      board_id: Number(formData.board_id),

      class_ids: formData.class_ids.map(Number),

      subject_books: formData.selected_subjects.map((subjectId) => {
        const subject = formData.subject_books.find(
          (item) => String(item.subject_id) === String(subjectId),
        );

        return {
          subject_id: Number(subjectId),

          book_ids: subject.book_ids.map(Number),
        };
      }),
    };

    // API
    try {
      setSubmitting(true);

      await createTeacher(teacherData);
      setSuccessMessage(
        "Teacher registration successful. Please contact your administrator to activate your account.",
      );
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // MONTHS
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // LOADING STATE
  const loading = loadingRegistrationData;

  // JSX

  return (
    <div id="akTeacherRegistration">
      <aside className="teacherRegistrationIntro">
        <CompanyBrand />
        <div><span className="registrationEyebrow">JOIN THE TEACHING COMMUNITY</span><h1>Great teaching<br />starts with you.</h1><p>Create your AKTech account and bring lessons, assignments, and student progress into one workspace.</p></div>
        <div className="registrationBenefits"><span><b>01</b> Plan lessons and share resources</span><span><b>02</b> Create meaningful class work</span><span><b>03</b> Help every student grow</span></div>
        <small>Have your school details ready. Fields marked * are required.</small>
      </aside>
    <AuthLayout isRegistration>
      <form
        className="loginForm registerForm teacherRegisterForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="registerTitle"><span>YOUR TEACHING WORKSPACE</span><h2>Create your teacher account</h2><p>Add your personal and school details to get started.</p></header>

        <div className="registerGrid">
          {/* =================================
              TEACHER NAME
          ================================= */}

          <label>
            Full name *
            <input
              type="text"
              {...register("teacher_name", {
                required: "Teacher name is required.",

                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters.",
                },
              })}
            />
            {errors.teacher_name && (
              <small className="fieldError">
                {errors.teacher_name.message}
              </small>
            )}
          </label>

          {/* =================================
              MOBILE
          ================================= */}

          <label>
            Mobile *
            <input
              type="tel"
              {...register("teacher_mobile", {
                required: "Mobile number is required.",

                pattern: {
                  value: /^[0-9]{10}$/,

                  message: "Enter a valid 10-digit mobile number.",
                },
              })}
            />
            {errors.teacher_mobile && (
              <small className="fieldError">
                {errors.teacher_mobile.message}
              </small>
            )}
          </label>

          {/* =================================
              EMAIL
          ================================= */}

          <label>
            Official email *
            <input
              type="email"
              {...register("teacher_email", {
                required: "Email is required.",

                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                  message: "Enter a valid email.",
                },
              })}
            />
            {errors.teacher_email && (
              <small className="fieldError">
                {errors.teacher_email.message}
              </small>
            )}
          </label>

          {/* =================================
              PASSWORD
          ================================= */}

          <label>
            Create password *
            <input
              type="password"
              {...register("teacher_password", {
                required: "Password is required.",

                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            {errors.password && (
              <small className="fieldError">{errors.password.message}</small>
            )}
          </label>

          {/* =================================
              CONFIRM PASSWORD
          ================================= */}

          <label>
            Confirm password *
            <input
              type="password"
              {...register("teacher_password_confirmation", {
                required: "Please confirm your password.",

                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />
            {errors.teacher_password_confirmation && (
              <small className="fieldError">
                {errors.teacher_password_confirmation.message}
              </small>
            )}
          </label>

          {/* =================================
              SCHOOL
          ================================= */}

          <label>
            School name *
            <input
              type="text"
              {...register("school_name", {
                required: "School name is required.",
              })}
            />
            {errors.school_name && (
              <small className="fieldError">{errors.school_name.message}</small>
            )}
          </label>

          {/* =================================
              PRINCIPAL
          ================================= */}

          <label>
            Principal name *
            <input
              type="text"
              {...register("principal_name", {
                required: "Principal name is required.",
              })}
            />
            {errors.principal_name && (
              <small className="fieldError">
                {errors.principal_name.message}
              </small>
            )}
          </label>

          {/* =================================
              DOB
          ================================= */}

          <label>
            Date of birth *
            <input
              type="date"
              {...register("dob", {
                required: "Date of birth is required.",
              })}
            />
            {errors.dob && (
              <small className="fieldError">{errors.dob.message}</small>
            )}
          </label>

          {/* =================================
              SESSION
          ================================= */}

          <label>
            Session start *
            <select
              {...register("session_start", {
                required: "Please select session.",
              })}
            >
              <option value="">Select month</option>

              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors.session_start && (
              <small className="fieldError">
                {errors.session_start.message}
              </small>
            )}
          </label>

          {/* =================================
              REPRESENTATIVE NAME
          ================================= */}

          <label>
            Representative name *
            <input
              type="text"
              {...register("representative_name", {
                required: "Representative name is required.",
              })}
            />
            {errors.representative_name && (
              <small className="fieldError">
                {errors.representative_name.message}
              </small>
            )}
          </label>

          {/* =================================
              REPRESENTATIVE CONTACT
          ================================= */}

          <label>
            Representative contact *
            <input
              type="tel"
              {...register("representative_contact", {
                required: "Representative contact is required.",

                pattern: {
                  value: /^[0-9]{10}$/,

                  message: "Enter a valid 10-digit mobile number.",
                },
              })}
            />
            {errors.representative_contact && (
              <small className="fieldError">
                {errors.representative_contact.message}
              </small>
            )}
          </label>

          {/* =================================
              BOARD
          ================================= */}

          <label>
            Board *
            <select
              {...register("board_id", {
                required: "Please select a board.",
              })}
              onChange={handleBoardChange}
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading boards..." : "Select board"}
              </option>

              {boards?.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.board_name}
                </option>
              ))}
            </select>
            {errors.board_id && (
              <small className="fieldError">{errors.board_id.message}</small>
            )}
          </label>

          {/* =================================
              CLASSES
          ================================= */}

          <div className="registerDropdownField registerWide">
            <span>Classes *</span>

            <details className="multiSelectDropdown">
              <summary>
                {getDropdownText(
                  classIds,
                  "Select classes",
                  "classes selected",
                )}
              </summary>

              <div className="multiSelectMenu">
                {classes?.map((classItem) => {
                  const checked = classIds.includes(String(classItem.id));

                  return (
                    <label key={classItem.id}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          handleClassChange(classItem.id, event.target.checked)
                        }
                      />

                      {classItem.class_name}
                    </label>
                  );
                })}

                <div className="multiSelectActions">
                  <button
                    type="button"
                    disabled={!classIds.length}
                    onClick={(event) =>
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open")
                    }
                  >
                    Add Classes
                  </button>
                </div>
              </div>
            </details>
          </div>

          {/* =================================
              SUBJECTS
          ================================= */}

          <div className="registerDropdownField registerWide">
            <span>Subjects *</span>

            <details
              className={`multiSelectDropdown ${!boardId ? "isDisabled" : ""}`}
            >
              <summary>
                {!boardId
                  ? "Select a board first"
                  : loadingSubjects
                    ? "Loading subjects..."
                    : getDropdownText(
                        selectedSubjects,
                        "Select subjects",
                        "subjects selected",
                      )}
              </summary>

              {boardId && (
                <div className="multiSelectMenu">
                  {!subjects?.length && !loadingSubjects && (
                    <span>No subjects available.</span>
                  )}

                  {subjects?.map((subject) => {
                    const checked = selectedSubjects.includes(
                      String(subject.id),
                    );

                    return (
                      <label key={subject.id}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            handleSubjectChange(
                              subject.id,
                              event.target.checked,
                            )
                          }
                        />

                        {subject.subject_name}
                      </label>
                    );
                  })}
                </div>
              )}
            </details>
          </div>

          {/* =================================
              BOOKS
          ================================= */}

          {selectedSubjects.length > 0 && (
            <div className="registerDropdownField registerWide">
              <span>Books *</span>

              {subjects
                ?.filter((subject) =>
                  selectedSubjects.includes(String(subject.id)),
                )
                .map((subject) => {
                  const subjectId = String(subject.id);

                  const books = booksBySubject?.[subjectId] || [];

                  return (
                    <div className="subjectBooksDropdown" key={subject.id}>
                      <strong>{subject.subject_name}</strong>

                      <details className="multiSelectDropdown">
                        <summary>{getBookDropdownText(subjectId)}</summary>

                        <div className="multiSelectMenu">
                          {books.map((book) => {
                            const subjectData = subjectBooks.find(
                              (item) => String(item.subject_id) === subjectId,
                            );

                            const checked = (
                              subjectData?.book_ids || []
                            ).includes(String(book.id));

                            return (
                              <label key={book.id}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(event) =>
                                    handleBookChange(
                                      subjectId,
                                      book.id,
                                      event.target.checked,
                                    )
                                  }
                                />

                                {book.book_name}
                              </label>
                            );
                          })}

                          {loadingBooks?.[subjectId] && (
                            <span>Loading books...</span>
                          )}

                          {!loadingBooks?.[subjectId] &&
                            booksBySubject?.[subjectId] &&
                            !books.length && <span>No books available.</span>}
                        </div>
                      </details>
                    </div>
                  );
                })}
            </div>
          )}

          {/* =================================
              SCHOOL ADDRESS
          ================================= */}

          <label className="registerWide">
            School address *
            <textarea
              {...register("school_address", {
                required: "School address is required.",
              })}
            />
            {errors.school_address && (
              <small className="fieldError">
                {errors.school_address.message}
              </small>
            )}
          </label>

          {/* =================================
              PERSONAL ADDRESS
          ================================= */}

          <label className="registerWide">
            Personal address *
            <textarea
              {...register("personal_address", {
                required: "Personal address is required.",
              })}
            />
            {errors.personal_address && (
              <small className="fieldError">
                {errors.personal_address.message}
              </small>
            )}
          </label>
        </div>

        {/* =================================
            API ERROR
        ================================= */}

        {displayError && (
          <p className="authError" role="alert">
            {displayError}
          </p>
        )}
        {successMessage && (
          <p className="authSuccess" role="status">
            {successMessage}
          </p>
        )}

        {/* =================================
            BUTTONS
        ================================= */}

        <div className="registrationActions">
          <button
            className="registerSubmit"
            type="submit"
            disabled={loading || submitting || Boolean(successMessage)}
          >
            {submitting
              ? "Registering..."
              : successMessage
                ? "Registration complete"
                : "Register Teacher"}
          </button>

          <button
            className="registrationBackButton"
            type="button"
            onClick={() => navigate("/login")}
          >
            Back to login
          </button>
        </div>
      </form>
    </AuthLayout>
    </div>
  );
}
